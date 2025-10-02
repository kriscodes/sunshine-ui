import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import './index.css';

export default function TourForm({
  apiBase,
  endpoint = '/tours',
  onSubmitSuccess,
  onSubmitError,
  className = '',
  initialValues = {},
}) {
  const env = typeof import.meta !== 'undefined' ? import.meta.env : process.env;
  const API_BASE =
    apiBase ||
    env?.VITE_API_BASE_URL ||
    env?.REACT_APP_API_BASE_URL ||
    'https://sunshine-api.onrender.com';

  const PROGRAM_OPTIONS = [
    'two-year-old program',
    'three-year-old program',
    'pre-k class',
    'after-school program',
  ];

  const TIME_OPTIONS = useMemo(() => {
    const opts = [];
    const pad = (n) => String(n).padStart(2, '0');
    const label = (h, m) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      let hr = h % 12;
      if (hr === 0) hr = 12;
      return `${hr}:${pad(m)} ${ampm}`;
    };
    for (let h = 8; h <= 17; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 17 && m > 0) break;
        const value = `${pad(h)}:${pad(m)}`;
        opts.push({ value, label: label(h, m) });
      }
    }
    return opts;
  }, []);

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [errorMsg, setErrorMsg] = useState('');
  const [hintMsg, setHintMsg] = useState('');

  const [form, setForm] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    location: 'lynwood', 
    child_name: '',
    program: '',
    preferred_date: '',
    preferred_time: '',
    ...initialValues,
  }));

  const steps = useMemo(
    () => [
      { key: 'contact', title: 'Tell us about you', required: ['name', 'email'] },
      { key: 'reach',   title: 'How can we reach you?', required: ['phone', 'location'] },
      { key: 'child',   title: 'About your child', required: ['child_name', 'program'] },
      { key: 'visit',   title: 'Preferred tour time', required: ['preferred_date', 'preferred_time'] },
    ],
    []
  );

  const totalSteps = steps.length;
  const current = steps[step];

  const PROGRAM_SET = new Set(PROGRAM_OPTIONS);
  const validators = {
    name: (v) => (!!v && v.trim().length >= 2) || 'Please enter the parent name.',
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254) || 'Please enter a valid email.',
    phone: (v) => {
      const digits = (v || '').replace(/\D+/g, '');
      return (digits.length >= 10 && digits.length <= 15) || 'Enter a valid phone number.';
    },
    location: (v) => (v === 'lynwood' || v === 'compton') || 'Choose a location.',
    child_name: (v) => (!!v && v.trim().length >= 2) || 'Enter your child’s name.',
    program: (v) => PROGRAM_SET.has(v) || 'Please select a program.',
    preferred_date: (v) => !!v || 'Select a date.',
    preferred_time: (v) => !!v || 'Select a time.',
  };

  const [touched, setTouched] = useState({});
  const setField = useCallback((name, value) => setForm((f) => ({ ...f, [name]: value })), []);
  const markTouched = useCallback((name) => setTouched((t) => ({ ...t, [name]: true })), []);

  const validateField = useCallback(
    (name) => {
      const fn = validators[name];
      if (!fn) return null;
      const res = fn(form[name]);
      return res === true ? null : res;
    },
    [form, validators]
  );

  const stepErrors = useMemo(() => {
    const errs = {};
    for (const name of current.required) {
      const msg = validateField(name);
      if (msg) errs[name] = msg;
    }
    return errs;
  }, [current, validateField]);

  const canNext = useMemo(() => Object.keys(stepErrors).length === 0, [stepErrors]);

  const firstFieldRef = useRef(null);
  const canSetSelection = (el) => {
    if (!el || typeof el.setSelectionRange !== 'function') return false;
    const tag = el.tagName?.toUpperCase();
    if (tag === 'TEXTAREA') return true;
    if (tag !== 'INPUT') return false;
    return new Set(['text', 'email', 'tel', 'search', 'url', 'password']).has(el.type);
  };
  useEffect(() => {
    setHintMsg('');
    const el = firstFieldRef.current;
    if (el) {
      try {
        el.focus({ preventScroll: true });
        if (canSetSelection(el)) {
          const n = (el.value?.length ?? 0);
          el.setSelectionRange(n, n);
        }
      } catch {  }
    }
  }, [step]);

  const revealErrors = () => {
    const touchedNames = Object.fromEntries(current.required.map((n) => [n, true]));
    setTouched((t) => ({ ...t, ...touchedNames }));
    setHintMsg('Please complete the highlighted fields to continue.');
  };

  const handleNext = () => {
    if (!canNext) return revealErrors();
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!canNext) return revealErrors();
    try {
      setStatus('submitting');
      setErrorMsg('');
      setHintMsg('');

      const parentName = form.name.trim();
      const payload = {
        parent_name: parentName,
        name: parentName,                  
        email: form.email.trim(),
        phone: form.phone.trim(),
        school: form.location,             
        child_name: form.child_name.trim(),
        program: form.program,
        tour_date: form.preferred_date || null, 
        tour_time: form.preferred_time || null, 
        source: 'sunshine-ui',
      };

      const url = `${API_BASE.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
      const res = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        withCredentials: false,
      });

      setStatus('success');
      onSubmitSuccess?.(payload, res);
    } catch (err) {
      console.error('TourForm submit failed:', err);
      setStatus('error');
      const apiMsg =
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong. Please try again.';
      setErrorMsg(apiMsg);
      onSubmitError?.(err);
    }
  };

  const renderStep = () => {
    switch (current.key) {
      case 'contact':
        return (
          <div className="tf-panel tf-fadeIn" aria-labelledby="tf-h-contact">
            <div className="tf-panelInner">
              <h3 id="tf-h-contact" className="tf-panelTitle">Tell us about you</h3>
              <div className="tf-fields single">
                <div className={`tf-field ${touched.name && validateField('name') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-name">Parent name</label>
                  <input
                    id="tf-name"
                    ref={firstFieldRef}
                    type="text"
                    inputMode="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    onBlur={() => markTouched('name')}
                    aria-invalid={!!(touched.name && validateField('name'))}
                    aria-describedby="tf-name-err"
                  />
                  {touched.name && validateField('name') && (
                    <div id="tf-name-err" className="tf-error">{validateField('name')}</div>
                  )}
                </div>

                <div className={`tf-field ${touched.email && validateField('email') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-email">Email</label>
                  <input
                    id="tf-email"
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    onBlur={() => markTouched('email')}
                    aria-invalid={!!(touched.email && validateField('email'))}
                    aria-describedby="tf-email-err"
                  />
                  {touched.email && validateField('email') && (
                    <div id="tf-email-err" className="tf-error">{validateField('email')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reach':
        return (
          <div className="tf-panel tf-fadeIn" aria-labelledby="tf-h-reach">
            <div className="tf-panelInner">
              <h3 id="tf-h-reach" className="tf-panelTitle">How can we reach you?</h3>
              <div className="tf-fields single">
                <div className={`tf-field ${touched.phone && validateField('phone') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-phone">Phone</label>
                  <input
                    id="tf-phone"
                    ref={firstFieldRef}
                    type="tel"
                    inputMode="tel"
                    name="phone"
                    placeholder="(555) 555‑5555"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    onBlur={() => markTouched('phone')}
                    aria-invalid={!!(touched.phone && validateField('phone'))}
                    aria-describedby="tf-phone-err"
                  />
                  {touched.phone && validateField('phone') && (
                    <div id="tf-phone-err" className="tf-error">{validateField('phone')}</div>
                  )}
                </div>

                <div className={`tf-field ${touched.location && validateField('location') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-location">Preferred location</label>
                  <select
                    id="tf-location"
                    name="location"
                    value={form.location}
                    onChange={(e) => setField('location', e.target.value)}
                    onBlur={() => markTouched('location')}
                    aria-invalid={!!(touched.location && validateField('location'))}
                    aria-describedby="tf-location-err"
                  >
                    <option value="lynwood">Lynwood</option>
                    <option value="compton">Compton</option>
                  </select>
                  {touched.location && validateField('location') && (
                    <div id="tf-location-err" className="tf-error">{validateField('location')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'child':
        return (
          <div className="tf-panel tf-fadeIn" aria-labelledby="tf-h-child">
            <div className="tf-panelInner">
              <h3 id="tf-h-child" className="tf-panelTitle">About your child</h3>
              <div className="tf-fields single">
                <div className={`tf-field ${touched.child_name && validateField('child_name') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-child-name">Child’s name</label>
                  <input
                    id="tf-child-name"
                    ref={firstFieldRef}
                    type="text"
                    name="child_name"
                    placeholder="Alex"
                    value={form.child_name}
                    onChange={(e) => setField('child_name', e.target.value)}
                    onBlur={() => markTouched('child_name')}
                    aria-invalid={!!(touched.child_name && validateField('child_name'))}
                    aria-describedby="tf-child-name-err"
                  />
                  {touched.child_name && validateField('child_name') && (
                    <div id="tf-child-name-err" className="tf-error">{validateField('child_name')}</div>
                  )}
                </div>

                <div className={`tf-field ${touched.program && validateField('program') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-program">Program</label>
                  <select
                    id="tf-program"
                    name="program"
                    value={form.program}
                    onChange={(e) => setField('program', e.target.value)}
                    onBlur={() => markTouched('program')}
                    aria-invalid={!!(touched.program && validateField('program'))}
                    aria-describedby="tf-program-err"
                  >
                    <option value="" disabled>Select a program</option>
                    {PROGRAM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {touched.program && validateField('program') && (
                    <div id="tf-program-err" className="tf-error">{validateField('program')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'visit':
      default:
        return (
          <div className="tf-panel tf-fadeIn" aria-labelledby="tf-h-visit">
            <div className="tf-panelInner">
              <h3 id="tf-h-visit" className="tf-panelTitle">Preferred tour time</h3>
              <div className="tf-fields single">
                <div className={`tf-field ${touched.preferred_date && validateField('preferred_date') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-date">Date</label>
                  <input
                    id="tf-date"
                    ref={firstFieldRef}
                    type="date"
                    name="preferred_date"
                    value={form.preferred_date}
                    onChange={(e) => setField('preferred_date', e.target.value)}
                    onBlur={() => markTouched('preferred_date')}
                    aria-invalid={!!(touched.preferred_date && validateField('preferred_date'))}
                    aria-describedby="tf-date-err"
                  />
                  {touched.preferred_date && validateField('preferred_date') && (
                    <div id="tf-date-err" className="tf-error">{validateField('preferred_date')}</div>
                  )}
                </div>

                <div className={`tf-field ${touched.preferred_time && validateField('preferred_time') ? 'is-error' : ''}`}>
                  <label htmlFor="tf-time">Time</label>
                  <select
                    id="tf-time"
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={(e) => setField('preferred_time', e.target.value)}
                    onBlur={() => markTouched('preferred_time')}
                    aria-invalid={!!(touched.preferred_time && validateField('preferred_time'))}
                    aria-describedby="tf-time-err"
                  >
                    <option value="" disabled>Select a time</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {touched.preferred_time && validateField('preferred_time') && (
                    <div id="tf-time-err" className="tf-error">{validateField('preferred_time')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (status === 'success') {
    return (
      <section className={`tf ${className}`}>
        <div className="tf-card tf-success">
          <div className="tf-successIcon" aria-hidden>✓</div>
          <h3>Thanks! We’ve received your tour request.</h3>
          <p>
            Our team will reach out to confirm your visit at the {form.location === 'compton' ? 'Compton' : 'Lynwood'} campus.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`tf ${className}`}>
      <form
        className="tf-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < totalSteps - 1) handleNext(); else handleSubmit();
        }}
        noValidate
      >
        
        <header className="tf-header">
          <div className="tf-title">
            <h2>Book a Tour</h2>
            <p className="tf-subtitle">Just a few quick questions—takes under a minute.</p>
          </div>
          <div className="tf-progress" aria-hidden>
            <div className="tf-progressBar" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
        </header>

        <div className="tf-stage">
          {renderStep()}
        </div>

        <footer className="tf-actions">
          <button
            type="button"
            className="tf-btn tf-btn--ghost"
            onClick={handleBack}
            disabled={step === 0 || status === 'submitting'}
          >
            Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              type="button"
              className="tf-btn tf-btn--primary"
              onClick={handleNext}
              disabled={status === 'submitting'}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="tf-btn tf-btn--primary"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : 'Submit'}
            </button>
          )}
        </footer>

        {hintMsg && status !== 'error' && (
          <div className="tf-hint" role="status">{hintMsg}</div>
        )}
        {status === 'error' && (
          <div className="tf-errorBanner" role="alert">
            {errorMsg || 'Something went wrong. Please try again.'}
          </div>
        )}
      </form>
    </section>
  );
}

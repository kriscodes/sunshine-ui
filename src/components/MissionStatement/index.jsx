import React from 'react'
import './styles.css'

const MissionStatement = () => {

    return (
        <div className='main-container'>
            <p>
                Sunshine is dedicated to meeting the individual needs of children and families, 
                fostering a sense of pride in self and community, as it upholds best practices in 
                the field of Early Care and Education, centered on the whole-child approach to 
                learning.
            </p>
            <p>
                As educators, our mission is to provide a safe and developmentally 
                appropriate learning environment, which fosters a child’s natural desire to 
                explore, discover, create, and become a lifelong learner. 
            </p>
            <p>
                Establishing and maintaining secure connections with the children in our care, 
                teaches them that they are part of a caring community that will continue to 
                watch them grow with love. We believe respect, diversity, and inclusivity is 
                very important in Early Childhood Education.
            </p>
            <p>
                Sunshine is committed to providing an inclusive, and 
                welcoming environment for all members of our staff, children, families, 
                volunteers, subcontractors, and vendors. We do not discriminate against anyone 
                on the basis of race, creed, color, ethnicity, national origin, religion, sexual 
                orientation, gender expression, age, physical or mental ability, veteran status, 
                military obligations, and marital status, in any of its activities or operations. 
                At Sunshine, we aim to provide a learning environment that is inviting, accepting, 
                understanding & ever-growing.
            </p>
            <div className='container' >
                <div className='main-flex-container'>
                    <div className='text-container'>
                        <p>
                            As educators, our mission is to provide a safe and developmentally 
                            appropriate learning environment, which fosters a child’s natural desire to 
                            explore, discover, create, and become a lifelong learner. 
                        </p>
                        <p>
                            Establishing and maintaining secure connections with the children in our care, 
                            teaches them that they are part of a caring community that will continue to 
                            watch them grow with love. We believe respect, diversity, and inclusivity is 
                            very important in Early Childhood Education.
                        </p>
                    </div>
                    <div>
                        <img className='mission-image' src="/kids.jpg" alt="alt"  />
                    </div>
                </div>
                <div className='main-flex-container'>
                    <div>
                        <img src="kids.jpg" alt="alt" className='mission-image' />
                    </div>
                    <div className='text-container'>
                        <p>
                            Sunshine is committed to providing an inclusive, and 
                            welcoming environment for all members of our staff, children, families, 
                            volunteers, subcontractors, and vendors. We do not discriminate against anyone 
                            on the basis of race, creed, color, ethnicity, national origin, religion, sexual 
                            orientation, gender expression, age, physical or mental ability, veteran status, 
                            military obligations, and marital status, in any of its activities or operations. 
                            At Sunshine, we aim to provide a learning environment that is inviting, accepting, 
                            understanding & ever-growing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MissionStatement;
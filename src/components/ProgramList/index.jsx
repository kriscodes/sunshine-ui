import React from "react";
import programs from '../../data/programs.json'
import { Link } from 'react-router-dom';
import "./styles.css"

const ProgramList = () => {
    return (
        <div>
            <div className="program-list-container">
                {programs.map((program, index) => {
                    return (
                        <div className="program-container">
                            {/*<Link to={{
                                pathname: "/program",
                                state: program
                            }} style={{textDecoration: "none", color: "black"}}>*/}
                                <div >
                                    <img 
                                    style={{ 
                                        maxHeight: "400px",  
                                        maxWidth: "300px",
                                        display: "block",
                                        width: "auto",
                                        height: "auto",
                                        marginLeft: "auto",
                                        marginRight: "auto"
                                    }}
                                    src={program.image} 
                                    alt="" 
                                    />
                                    <div>
                                        <p style={{ textAlign:"center" }}>{program.name}</p>
                                        <p style={{ padding: "8px 32px" }}>{program.description}</p>
                                    </div>
                                </div>
                            {/*</Link>*/}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ProgramList;
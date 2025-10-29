import React from "react";
import "./RegiComplete.css"
export default function RegiComplete({onBack}){
    return(
        <div className="completePage">
			<h2>Registration complete!</h2>
			<button onClick={() => onBack()}>
                Finished
            </button>

		</div>
    );
}
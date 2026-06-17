function FinishScreen({points, maxPossiblePoints, highScore, dispatch}){
    const percentage = (points/maxPossiblePoints)*100;
    let emoji;
    if(percentage === 100) emoji = "🥇";
    if(percentage >= 80 && percentage <100) emoji = "🥉";
    if(percentage >= 50 && percentage <80) emoji = "🥉";
    if(percentage > 50) emoji = "😒🤷‍♂️";

    return(
        <>
            <p className="result">
                {emoji} Your score is <strong>{points}</strong> out of {maxPossiblePoints} {Math.ceil(percentage)}%
              </p>  
            <p className="highScore">
                (High Score : {highScore} Points)
            </p>
            <button className="btn btn-ui" onClick={()=>dispatch({type:"restart"})}>
                Restart
            </button>
        </>
    );
}
export default  FinishScreen;
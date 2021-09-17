var answer;
var score = 0;
var backgroundImages = [];
function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;
    answer = n1 + n2;
}
function checkAnswer() {
    const prediction = predictImage();
    if (prediction == answer) {
        score++;
        console.log(`Correct!! Score: ${score}`);
       if (score < 7){
        backgroundImages.push(`url('images/background${score}.svg')`)
       }
       else{
           alert('You have completed the game Congratulations Boi');
           backgroundImages = [];
           score = 0;
       }
        document.body.style.backgroundImage = backgroundImages;
    } else{
        console.log('OOps Check your calculation or try writing the answer neater next tym')
        if (score != 0){
            score--;
            backgroundImages.pop();
            setTimeout(function () {
                document.body.style.backgroundImage = backgroundImages;
            }, 1000);
        }else{
            console.log(`Incorrect!! Score: ${score}`);
        
        }

    }
}
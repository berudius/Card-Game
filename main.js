"use strict"

let cardQuantity;
let uniqPairArray = [];

let twoPressedCards = [];


let startTime = 0;

let player1 = {
    name: "",
    score: 0,
    totalScore: 0,
    iGoes: true
};
let player2 = {
    name: "",
    score: 0,
    totalScore: 0,
    iGoes: false,
    iAmInGame: false,
}

const GameMods = {
    SINGLE_PLAYER_GAME: 0,
    TWO_PLAYER_GAME: 1
}

let GameMode = GameMods.SINGLE_PLAYER_GAME;
let roundNum = 1;
let roundCounter = 0;
let twoPlayerGameStatistics = []; 





let previousIntervalId;
let intervalIdForTwoPlayerMod;
function Start(){

    if (previousIntervalId) {
        clearInterval(previousIntervalId);
    }
    if(intervalIdForTwoPlayerMod){
        clearInterval(intervalIdForTwoPlayerMod)
    }

    let documentCards = document.querySelectorAll(".card");
    ResetCards(documentCards);
    SetDocumentCardUniqNumber(documentCards);

    if(GameMode == GameMods.SINGLE_PLAYER_GAME){
        previousIntervalId = TimerStart();
    }

    else{
        ResetPlayerScore();

        let roundNumberNotif = document.querySelector(".round");
        roundNumberNotif.classList.toggle("hide-block");
        setTimeout(()=>{ roundNumberNotif.classList.toggle("hide-block");  intervalIdForTwoPlayerMod = StartTimeFromZero();},1500);
    }
}



function UpdateCardQuantity(){
    let gamePlace = document.querySelector(".game-place");
    gamePlace.innerHTML = "";


    let dropList = document.getElementById("drop-list");
    let selectedOptionValue = dropList[dropList.selectedIndex].textContent;
    cardQuantity = selectedOptionValue.split("x")[0] * 2;

    for(let i=0; i<cardQuantity; i++){
        let divCard = document.createElement("div");
        divCard.className = "card";
        gamePlace.append(divCard);
    }
}

function SetDocumentCardUniqNumber(documentCards){
    uniqPairArray = GetUnicPairArray(cardQuantity);
    for (let i = 0; i < cardQuantity; i++) {
        documentCards[i].setAttribute("data-unic-pair-number", uniqPairArray[i]);
        documentCards[i].addEventListener("click", ClickHandle);
    }
  
}

function ResetCards(documentCards){
    for (let i = 0; i < cardQuantity; i++) {
        documentCards[i].style.background = "";
    }
}

function ResetOnlyTwoCards(){
    twoPressedCards[0].style.background = "";
    twoPressedCards[1].style.background = "";
    twoPressedCards = [];
}






function GetDurationAndSetTimer(){
    let difficulty = document.querySelector(".drop-list-difficulty").value;
    let timer = document.querySelector(".timer");
    let duration = 0;

    switch(difficulty){
        case "easy":
            duration = 180;
            startTime = 180;
            break;
        case "normal":
            startTime = 120;
            duration = 120;
            break;
        case "hard":
            startTime = 60;
            duration = 60;
            break;
    }

    
    let minutes = duration/60;
    timer.textContent = `0${minutes}:00`;

    return duration;
}

function TimerStart(){
    


    let timer = document.querySelector(".timer");
    let duration = GetDurationAndSetTimer();


     let intervalId = setInterval(()=>{
        duration--;
        if(duration == 0){
            clearInterval(intervalId);
            alert("Час вийшов! Ви — програли.");
            ResetCards(document.querySelectorAll(".card"));
        }
        let minutes = Math.floor(duration/60);
        let seconds = duration - (minutes * 60)

        timer.textContent = `0${minutes}:`;
        if(seconds < 10){
            timer.textContent += "0";
        }
        timer.textContent += `${seconds}`;

  
       }, 1000); 

       return intervalId;
    
}





function IsAllCardsOpened(){
    let counter = 0;
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        if(card.style.background !=""){
            counter ++;
        }
    });

    return (counter == cardQuantity);
}

function ClickHandle(event) {
    let _this = event.target;
    let UnicPairNumber = _this.getAttribute("data-unic-pair-number");


    _this.classList.add("flipped");
    _this.style.background = `url(Images/${UnicPairNumber}.jpg)`;
    setTimeout(()=>{}, 500);
    
        twoPressedCards.push(_this);

        if (twoPressedCards.length == 2 && !TwoSameStyleCard(twoPressedCards)) {
            setTimeout(()=>{
                ResetOnlyTwoCards();
            }, 500);

            if(player1.iGoes && player2.iAmInGame){
                player1.iGoes = false;
                player2.iGoes = true;
            }
            else if(player2.iGoes){
                player1.iGoes = true;
                player2.iGoes = false;
            }
        }
        
        else if (twoPressedCards.length == 2) {

            twoPressedCards[0].removeEventListener("click", ClickHandle);
            twoPressedCards[1].removeEventListener("click", ClickHandle);
            twoPressedCards.forEach(card => card.classList.remove("flipped")); 
            twoPressedCards = [];
        
           
            if(player1.iGoes && GameMode == GameMods.TWO_PLAYER_GAME){
                let playerSpan1 = document.querySelector(".player-data1");
                player1.score += 1;
                playerSpan1.textContent = `player1: ${player1.name}; ${player1.score}`;
                
            }
            else if(player2.iGoes){
                let playerSpan2 = document.querySelector(".player-data2");
                player2.score += 1;
                playerSpan2.textContent = `player2: ${player2.name}; ${player2.score}`;
            }

            if(IsAllCardsOpened()){
                clearInterval(previousIntervalId);
                if(player2.iAmInGame == false){
                    DisplayRequiredTime();  
                }

                else{
                    clearInterval(intervalIdForTwoPlayerMod);
                    SetTimerZero();
                    AddStatisticData();
                    setTimeout(()=>{
                        // ResetPlayerScore(); //якщо розкоментовуватимеш, то видали цю ж функцію із Start()
                        // ResetCards(document.querySelectorAll(".card"));
                    }, 500);
                }
            }
            
        }

        SetGoesInfo()//update information about player who goes
 




        function DisplayRequiredTime(){
            let timer = document.querySelector(".timer");
            let timeText = timer.textContent;
            timeText = timeText.split(":");
            let minutes = Number(timeText[0]);
            let seconds = Number(timeText[1]);
            seconds = seconds + minutes*60;
            
        
            let difference = startTime - seconds;
            let differenceMinutes =  Math.floor(difference/60);
            let differenceSeconds = difference - (differenceMinutes * 60);
        
            let text = `0${differenceMinutes}:`;
            if(differenceSeconds< 10){
            text += "0";
        }
            text += `${differenceSeconds}`;
            alert(`Ви знайшли всі картки за ${text}`);
            ResetCards(document.querySelectorAll(".card"));
        }
        
        function TwoSameStyleCard(twoPressedCards){
        
            let cardIsEqual = false;
            if(twoPressedCards[0].style.background == twoPressedCards[1].style.background && twoPressedCards[0] !== twoPressedCards[1]){
                cardIsEqual = true;
            }
        
            return cardIsEqual;
        }
        
        function AddStatisticData(){
            let result = FindRoundWinner();
            let strStatistic = `Round №${roundCounter + 1} Результат: ${result}`;
            twoPlayerGameStatistics.push(strStatistic);
        
            ChekAllRoundsIsEnd();
        
        
            function ChekAllRoundsIsEnd(){
                roundCounter++;
                ChangeRoundSpanValue(roundCounter);
                if(roundCounter == roundNum){
                    DisplayTotalWinner();
                    roundCounter = 0;
                    ChangeRoundSpanValue(roundCounter);
            
                    twoPlayerGameStatistics = [];
                    player1.totalScore = 0;
                    player2.totalScore = 0;
                }
        
        
                function ChangeRoundSpanValue(roundCounter){
                    let RoundSpan = document.querySelector(".round");
                    RoundSpan.textContent = `Round ${roundCounter+1}`;
                }
                
        
                function DisplayTotalWinner(){
                    let winner = FindTotalWinner();
                    let strStatistic = "";
                    twoPlayerGameStatistics.forEach(el =>{
                        strStatistic += el + "\n";
                    });
                    alert(winner + "\n\n" + strStatistic);
        
        
        
        
        
        
                    function FindTotalWinner(){
                        let result = "";
                    
                        if(player1.totalScore > player2.totalScore){
                            result = `Виграв ${player1.name} із загальною кількістю очок ${player1.totalScore} проти ${player2.name} із загальною кількістю очок ${player2.totalScore}`;
                        }
                    
                        else if(player2.score > player1.score){
                            result = `Виграв ${player2.name} із загальною кількістю очок ${player2.totalScore} проти ${player1.name} із загальною кількістю очок ${player1.totalScore}`;
                        }
                    
                        else{
                            result = `НІЧИЯ`
                        }
                    
                        return result;
                    }
                }
            }
        
        
        
            function FindRoundWinner(){
        
                let result = "";
            
                if(player1.score > player2.score){
                    player1.totalScore += player1.score;
                    result = `Виграв ${player1.name} із очками ${player1.score} проти ${player2.name} із очками ${player2.score}`;
                    // alert(result);
                }
            
                else if(player2.score > player1.score){
                    result = `Виграв ${player2.name} із очками ${player2.score} проти ${player1.name} із очками ${player1.score}`;
                    player2.totalScore += player2.score;
                    // alert(result);
                }
            
                else{
                    result = `Здається у нас нічия`
                    // alert();
                }
            
                return result;
               
            }
        }
        
        function SetGoesInfo (){
            let goesInfo = document.querySelector(".goes-info");
        
        
            if(player1.iGoes && player2.iAmInGame){
               goesInfo.textContent = `Зараз ходить: ${player1.name}`;
           }
           else if(player2.iGoes){
               goesInfo.textContent = `Зараз ходить: ${player2.name}`;
           }
        }
}








function RechangeGameMode(){

    GameMode = GameMode == GameMods.SINGLE_PLAYER_GAME ? GameMods.TWO_PLAYER_GAME : GameMods.SINGLE_PLAYER_GAME
    ResetCards(document.querySelectorAll(".card"));
    HideOrOpenBlocks();
    SetTimerZero();
    if(previousIntervalId){ clearInterval(previousIntervalId)}
    if(intervalIdForTwoPlayerMod){ clearInterval(intervalIdForTwoPlayerMod)}

    if(GameMode == GameMods.TWO_PLAYER_GAME){
        let names = prompt("Введіть імена гравців:", "Alex Bero");
        names = names.split(' ');
        player1.name = names[0];
        player2.name = names[1];
        player2.iAmInGame = true;

        DisplayPlayersScoreSpan()
    }
    else{
        player2.iAmInGame = false;
    }

 
    function HideOrOpenBlocks(){
        let difficulty = document.querySelector(".drop-list-difficulty");
        let spanPlayerData1 = document.querySelector(".player-data1");
        let spanPlayerData2 = document.querySelector(".player-data2");
        let goesInfo = document.querySelector(".goes-info");
        let listRounds = document.querySelector(".drop-list-rounds");
        spanPlayerData1.classList.toggle("hide-block");
        spanPlayerData2.classList.toggle("hide-block");
        goesInfo.classList.toggle("hide-block");
        difficulty.classList.toggle("hide-block");
        listRounds.classList.toggle("hide-block");
    }
    
}

function ResetPlayerScore(){
    // player1.name = "";
    player1.iGoes = true;
    player1.score = 0;
    // player2.name = "";
    player2.score = 0;
    player2.iGoes = false;

    DisplayPlayersScoreSpan();
}

function SetTimerZero(){
    let timer = document.querySelector(".timer");
    timer.textContent = "00:00";
}

function StartTimeFromZero(){

        let timer = document.querySelector(".timer");
        let duration = 0;
    
         let intervalId = setInterval(()=>{
            duration++;

            let minutes = Math.floor(duration/60);
            let seconds = duration - (minutes * 60)
    
            timer.textContent = `0${minutes}:`;
            if(seconds < 10){
                timer.textContent += "0";
            }
            timer.textContent += `${seconds}`;
    
      
           }, 1000); 
    
           return intervalId;
}


function DisplayPlayersScoreSpan(){
    let player1Span = document.querySelector(".player-data1"); 
    player1Span.textContent = `Player1: ${player1.name}; score: ${player1.score}`;
    let player2Span = document.querySelector(".player-data2");
    player2Span.textContent = `Player2: ${player2.name}; score: ${player2.score}`;;
}



function ChangeRoundsQuantity(){
    let roundsList = document.querySelector(".drop-list-rounds");
    roundNum = roundsList.selectedIndex + 1;
}







function GetUnicPairArray(cardQuantity){

    let cards = [];
    let cardsIsBooked = [];

    for(let i=0; i< cardQuantity; i++){
        cards.push(0);
        cardsIsBooked.push(false);
    }




    const maxImageQuantity = 19;
    while (IsAllBooked(cardsIsBooked) != true) { 

        
        let randomNumber = Math.floor(Math.random()*(maxImageQuantity-1) + 1);

        let notUniqNumber = false;
        for (let j = 0; j < cards.length; j++)
        {
            if (cards[j] == randomNumber)
            {
                notUniqNumber = true;
                break;
            }
        }

        if (notUniqNumber == false)
        {
            let unicIndex1 = GetUnicIndex( cardsIsBooked, cardQuantity);
            let unicIndex2 = GetUnicIndex( cardsIsBooked, cardQuantity);



            cards[unicIndex1] = randomNumber;
            cards[unicIndex2] = randomNumber;
        }
    }

    return cards;
}


function GetUnicIndex(cardsIsBooked, cardQuantity)
{
    
    let UniqIndex = false;
    let unicIndexNumber = -1;

    while (!UniqIndex && !(IsAllBooked(cardsIsBooked)))
    {
        
        unicIndexNumber = Math.floor(Math.random() * cardQuantity);
        if (cardsIsBooked[unicIndexNumber] == false)
        {
            UniqIndex = true;
            cardsIsBooked[unicIndexNumber] = true;
        }
    }
    
    return unicIndexNumber;
}


function IsAllBooked(cardsIsBooked)
{
    let isAllBooked = false;
    for (let i = 0, counter = 0; i<cardsIsBooked.length; i++)
    {
        if (cardsIsBooked[i] == true)
        {
            counter++;
        }

        if (counter == cardsIsBooked.length)
        {
            isAllBooked = true;
        }
    }
    return isAllBooked;
}



UpdateCardQuantity();
GetDurationAndSetTimer();

























// function start(){
//     let documentCards = document.querySelectorAll(".card");
//     UnicPairArray = getUnicPairArray(cardQuantity);
//             for (let i =0; i< cardQuantity; i++)
//         {
//            for (let j = 0; j < cardQuantity; j++)
//            {
//                if (UnicPairArray[i] > UnicPairArray[j] && j>i)
//                {
//                    let temp = UnicPairArray[i];
//                    UnicPairArray[i] =UnicPairArray[j];
//                    UnicPairArray[j] = temp;
//                }
//            }
//         }
//     for (let i = 0; i < cardQuantity; i++) {
//         documentCards[i].style.background = `url(Images/${UnicPairArray[i]}.jpg)`
//     }
// }
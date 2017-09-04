

$("document").ready(function(){
      
    
/*---------------------------------------------------------------------
                       BUILD UI ELEMENTS
---------------------------------------------------------------------*/


      // Button answer container 
    var divContainer = document.createElement("div");
    divContainer.setAttribute("id", "radContainer");

    $("#question").after(divContainer);




/*---------------------------------------------------------------------
                       DECALRING VARIABLES FOR AJAX
---------------------------------------------------------------------*/
    var myAjaxData;
    var catId;
    var numbQuestInCat = "/api_count.php?category=" + catId;
    var catList = "/api_category.php";
    var randomQest = "/api.php?";
    var url = "https://opentdb.com";
    var catLookup = "https://opentdb.com/api_category.php";
   // var SessTokenUrlReq = "https://opentdb.com/api_token.php?command=request";
   // var SessTokenUrlReSet = "https://opentdb.com/api_token.php?command=reset&token=YOURTOKENHERE";

    var qnumber = 3;
    var quest;
    var points_correct;
    var point_incorrect;
    
    var questAmount = "amount="+ qnumber;
    


/*---------------------------------------------------------------------
                        AJAX METHOD
---------------------------------------------------------------------*/

var btn_qStart = $(".quizStart");
     btn_qStart.click(ajaxSelEvo);

     var questArray = new Array();
     var correctAnswerArray = new Array();
     var fullChoiceQuestarray = new Array();
     var globCountIndex = 0;


     function ajaxSelEvo(){
           $.getJSON(url + randomQest + questAmount).done(function(data){
            var myAjaxData = data;
            
               
            console.log(myAjaxData); 

/*---------------------------------------------------------------------
      grabing questions div and inputting question
---------------------------------------------------------------------*/
          function Printquests(questIndex = 0){

            $.each(myAjaxData.results, function(i, item){


              console.log("From my first  foreach ajaxm question: "+ item.question);
              console.log("this is my resources: "+ i);


              //saving questions in an array of questions
              
              var questions = item.question;
               questArray.push(questions);
               $("#question").html(questArray[questIndex]);
             })
          } //-- End of Printquest
              Printquests();


          function getAnswer(){
            $.each(myAjaxData.results, function(i, item){ 

              //saving correct ansewers in an array of questions
               var correct_answer = item.correct_answer;

               correctAnswerArray.push(correct_answer);



              //saving incorrect answers in an array 
               
               var answers_length = item.incorrect_answers.length;
              // console.log("from my first foreact incorect answers: " + answers_length)
               
               var choices = new Array();

                for (var j = 0; j < answers_length; j++) 
                {
                  var incorrect_answers = item.incorrect_answers[j];
                  choices.push(incorrect_answers);
                  console.log("This is the incorect answer with id:"+j+": "+choices[j]);
                }

                choices.push(correct_answer);

                //var iterator =i;

                var choices_length = choices.length;

            var answerRandNum = Math.round((Math.random()*(choices_length - 1) ));
              console.log("random number is: "+ answerRandNum);

               var temp;
                    
                 temp = choices[answerRandNum];
                 console.log("temp is: "+temp);
                 choices[answerRandNum] = choices[choices_length -1];
              console.log("answer being put in rand index is: "+choices[choices_length -1]);

                 choices[choices_length-1] = temp;

                 console.log("putting index back : "+choices[choices_length -1]);

                return fullChoiceQuestarray[i] = choices;
                //console.log("This is a full list of the Choices questions"+fullChoiceQuestarray);

               

            });//-- End of Each Answer
          }//-- End of GetAnswer func 

          getAnswer();

          

           // var choices_length = choices.length;
              //  console.log("this is the length of quest choices: " +choices_length);

              //Swap indexes

             
/*---------------------------------------------------------------------
                       Define Swapping Answer Methods
---------------------------------------------------------------------*/
     // function swapAnswers(){

     //  var choices_length = choices.length;

     //        var answerRandNum = Math.round((Math.random()*(choices_length - 1) ));
     //          console.log("random number is: "+ answerRandNum);

     //           var temp;
                    
     //             temp = choices[answerRandNum];
     //             console.log("temp is: "+temp);
     //             choices[answerRandNum] = choices[choices_length -1];
     //          console.log("answer being put in rand index is: "+choices[choices_length -1]);

     //             choices[choices_length-1] = temp;

     //             console.log("putting index back : "+choices[choices_length -1]);

     //    }

     //    swapAnswers();


        


/*---------------------------------------------------------------------
                       Define printing the answer elements
---------------------------------------------------------------------*/        

  function printAnswers(indi = 0){
    var corrAnsID;
     $.each(fullChoiceQuestarray[indi], function(i, el){



              var radChoice = document.createElement("button");
                        radChoice.setAttribute("type","submit");
                        radChoice.setAttribute("class", "btn  btn-primary btnAnswers allAnswerbtn");
                        radChoice.setAttribute("id", 'btnAnswers'+ i);
                        radChoice.setAttribute("value", el);
              var txtAnswer = document.createTextNode(el);
              radChoice.appendChild(txtAnswer);
                       // console.log(radChoice);

                       $("#radContainer").append(radChoice, "<br/>");
                       if(el == correctAnswerArray[indi])
                        corrAnsID = "btnAnswers"+ i;
                        console.log("im checking shit is: " + corrAnsID);
                       


                      // $("#radContainer").html("<button id='"+i+ "' class=radBtn value='"+el+"'>"+el+"</button> <br>");

                     //  console.log("From jquery each function :" +el );
                       //console.log(radChoice);
                      // }

            });

 /*---------------------------------------------------------------------
                       Define button corect / incorect
---------------------------------------------------------------------*/
     $(".btnAnswers").click(function(e) {
                         e.preventDefault();
                         var myChoiceAnwser= $(this).val();
                         var btnShowCorr = $("#"+corrAnsID).attr("class","ctAnswer");
                         var btnShowWro = $("#"+corrAnsID).attr("class","wgAnswer");
                         var btnShowCorrdis = $(".allAnswerbtn").attr("disabled","disabled");
                         btnShowCorrdis;

                         console.log(myChoiceAnwser);
                         if(correctAnswerArray[indi] == myChoiceAnwser ){
                           console.log("my chosen answer is: " + myChoiceAnwser)
                          btnShowCorr;

                         }else{
                          console.log("incorect");
                         btnShowWro;
                          btnShowCorr
                          
                         }
                       });


  }

 printAnswers();

    //console.log(questions);


    //Button gets the next question and set of answers 
 $("#nxtQ").click(function(e) {
   e.preventDefault();
   globCountIndex++;
   $("#radContainer .btnAnswers, br").remove();

   Printquests(globCountIndex);
   printAnswers(globCountIndex);



 });

 //Modal and Close remove all 

 $(".close, #myModal").click(function(e) {
   /* Act on the event */

   $("#radContainer ").children().remove();
 });


//-- End of Ajax Success Last Line
           }).fail(function()
            {

/*---------------------------------------------------------------------
                       On Ajax fail 
---------------------------------------------------------------------*/                
            console.log("cannot get information"); 
            }); //-- End of Ajax fail 
          
          
      };


   //grabing btn and adding click
    
    $("#myButton").click(function(){
      // console.log("button click"); 
        
      
    });
    
 
/*---------------------------------------------------------------------
                      TIMER FUNCTION
---------------------------------------------------------------------*/ 
var myTime = 0;
var inValVar;
function timer(){


  myTime += 1;

  $("#time").text(myTime);

  if(myTime == 60)
    clearInterval(inValVar);

}



    inValVar = setInterval(timer, 1000);
 

console.log("this is a return from timer func: "+ timer());


 
 



    
});


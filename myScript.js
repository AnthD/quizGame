

//$("document").ready(function(){
    
  
//----- Stop watch Function Globals ----//
    var time = 0; 
    var running = 0;
    var timeDisp = $("#timing");//---- End Stop watch Function Globals ---



/*---------------------------------------------------------------------
                        STOP WATCH FUNCTION
---------------------------------------------------------------------*/

//---Time  startPause ---
function startPause(){

    if(running == 0){
      running = 1;

      increment();

      console.log(" Started Stop Watch");
     
    }else{

      running = 0;
      console.log(" Stop Watch not Started ");
    }

}// End of Stop Watch
//--- Reset  ---- 
 function reset(){

    running = 0;
    time = 0;

    console.log(" Just Resetted the Stop Watch ");


} //End of Reset 

//---Time Increment ----

function increment(){
  
  if(running == 1){

      setTimeout(function(){
        time++;
        var mins = Math.floor(time/10/60);
        var secs = Math.floor(time/10);
        var tenths = time%10;

        timeDisp.text("Time: " + secs);

        if(secs == 60){
          reset();
          $(".allAnswerbtn").attr("disabled","disabled");
          $(".nxtQ").attr("disabled","disabled");
          //timeDisp.text(time);
          console.log(" checked secs and set running to 0");
        }
        

        
        increment();


      }, 100);

  }


} //End  of Increment 

  

//------ Game UIs  -------------//
    var divContainer = document.createElement("div");
    divContainer.setAttribute("id", "radContainer");
    $("#question").after(divContainer);
    var quest;
    var points_correct;
    var points_incorrect; //End Of Game UIs 


 

     

//---------Ajax global Variables  -----//

    var myAjaxData;
    var numbQuestInCat = "/api_count.php?category=";  //+ catId;
    var catList = "/api_category.php";
    var randomQest = "/api.php?";
    var url = "https://opentdb.com";
    var urlRand = url + randomQest;
    var catLookup = "https://opentdb.com/api_category.php";
     var qnumber = 50;
    var questAmount = "amount="+ qnumber;   
      var categ;
      var catId;
      var diffy;

//------ Retrieving catgory id -----//
     $("#category").change(function(){
      $( "#category option:selected" ).each(function() {

        //console.log(catId);
        catId = $(this).val();
        console.log(catId);


      });
      
      
    }); //End Catgory var event

//--------- Retrieving diffy var ---------//
     

      $(".diff ").click(function(){

        $(":checked").change(function(){
           diffy = $(this).val();
          console.log(diffy);
        })
        
      });//End diffy --

      //---- Session Tokens 
       var myToken;
    var SessTokenUrlReq = "https://opentdb.com/api_token.php?command=request";
   
    var SessTokenUrlReSet = "https://opentdb.com/api_token.php?command=reset&token="+myToken;
     var sessKey;
     var sessUrl;
    var token;
   

$(".resetQues").click(function(e){

  e.preventDefault();



      $.getJSON(SessTokenUrlReSet).done(function(data){

      console.log(data);

      sessKey = data.token;
      console.log("Session key: "+sessKey);


    sessionStorage.setItem('token', sessKey);

    token = sessKey;


    });
})

//---- Getting and setting Session Storage 

if(token != ''){

  myToken = sessionStorage.getItem('token');

  console.log("This is my token friend: "+ myToken);

  var sessUrl = "&token="+myToken;
}else{

      $.getJSON(SessTokenUrlReq).done(function(data){

      console.log(data);

      sessKey = data.token;
      console.log("Session key: "+sessKey);


    sessionStorage.setItem('token', sessKey);

    token = sessKey;

      console.log("token now equal sesskey:"+token);

    }).fail()
}





//-- End of  Ajax Global Variables -----//

console.log("the toke is: "+ token)
/*---------------------------------------------------------------------
                        AJAX 1 METHOD
---------------------------------------------------------------------*/
$.getJSON(url + catList).done(function(data){
$.each(data,function(i, item){
console.log("Ajx1 Success");
console.log(item);
//console.log(i);


var myCateLength = item.length;
console.log(myCateLength);

  for (var t = 0; t < myCateLength; t++) {
    $("#category").append("<option value = "+item[t].id+">"+ item[t].name+" </option>");
    
  }


  
});

}).fail(function(){

console.log("First Ajax failed");
});//--- End of Ajax 1



//------ Start Quiz button -----
var btn_qStart = $(".quizStart");
    btn_qStart.click(function(e){

      e.preventDefault();

      ajaxSelEvo();

    });


/*---------------------------------------------------------------------
                   Btn Quiz Start AJAX METHOD
---------------------------------------------------------------------*/
    console.log("sess url: "+ sessUrl);
     function ajaxSelEvo(){
      //----- points init ---
            points_correct = 0;
            points_incorrect = 0;
            console.log(" what tye are the points: "+ points_incorrect)
            console.log(" what tye are the points: "+ points_correct)
            $("#pointsDisp").html("Correct: "+ points_correct +"/"+  points_incorrect+" :Wrong"); //---End points display

            //--- Initlizing Categ and Diff url parameters
            categ = (catId != null) ? "&category=" + catId : '';
            var diff = (diffy != null)? "&difficulty="+diffy : '';





    
           $.getJSON(urlRand+ questAmount+ sessUrl + categ +diff).done(function(data){
                var myAjaxData = data;
                
                 console.log("this is from categ: " + categ);

                var questArray = new Array();
                var correctAnswerArray = new Array();
                var fullChoiceQuestarray = new Array();
                var globCountIndex = 0;
                var correct_answer;
                   
                console.log(myAjaxData); 

/*---------------------------------------------------------------------
      grabing questions div and inputting question
    ---------------------------------------------------------------------*/
              function Printquests(questIndex = 0){

                $.each(myAjaxData.results, function(i, item){



                  //saving questions in an array of questions
                  
                  var questions = item.question;
                   questArray.push(questions);
                   $("#question").html((questIndex+ 1) +" : "+ questArray[globCountIndex]);
                 })
              } //-- End of Printquest
                  Printquests();


          function getAnswer(){
            $.each(myAjaxData.results, function(i, item){ 

              //saving correct ansewers in an array of questions
               correct_answer = item.correct_answer;

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
              var changeHtml = $('<div>').html(txtAnswer).text();
              console.log("Desocodoming the URI " + changeHtml);
              radChoice.append(changeHtml);
                       // console.log(radChoice);

                       $("#radContainer").append(radChoice, "<br/>");
                       if(el == correctAnswerArray[globCountIndex])
                        corrAnsID = "btnAnswers"+ i;
                        console.log("im checking shit is: " + corrAnsID);
                     

            });

 /*---------------------------------------------------------------------
                       Define button corect / incorect
---------------------------------------------------------------------*/
     $(".btnAnswers").click(function(e) {
                         e.preventDefault();
                         var myChoiceAnwser= $(this).val();
                         var btnShowCorr = $("#"+corrAnsID).css("background-color","green");
                         var btnShowWro = $(this).css("background-color","red");
                         var btnShowCorrdis = $(".allAnswerbtn").attr("disabled","disabled");
                         btnShowCorrdis;

                         console.log(myChoiceAnwser);
                         console.log("CorrectAnser: " + correctAnswerArray[globCountIndex])
                         if(correctAnswerArray[globCountIndex] == myChoiceAnwser ){
                           console.log("Correct - my chosen answer is: " + myChoiceAnwser)
                          //btnShowCorr;
                         $(this).css("background-color", "green");
                         points_correct+=1;

                        

                         }else{
                            console.log(myChoiceAnwser+ " is incorect, the answer is "+ correctAnswerArray[globCountIndex]);
                            btnShowWro;
                            btnShowCorr;
                            //$(this).css("background-color", "red");
                            points_incorrect+=1;

                         }

                          $(".nxtQ").removeAttr("disabled");
                          $("#pointsDisp").html("Correct: "+ points_correct +"/"+  points_incorrect+" :Wrong");                          console.log(" what tye are the points: "+ points_incorrect)

                       });
$(".nxtQ").attr("disabled","disabled");

  }

 printAnswers(globCountIndex);

 startPause(); 

 //--- Stop watch invoke ---//



    //console.log(questions);


    //Button gets the next question and set of answers 
 $("#nxtQ").click(function(e) {
   e.preventDefault();
   globCountIndex++;
   

   Printquests(globCountIndex);
   $("#radContainer ").children().remove();
   printAnswers(globCountIndex);



 });

 //--- Modal and Close remove all 

 $(".myCloseBtn").click(function(e) {
   /* Act on the event */
     

   $("#radContainer ").children().remove();
   //$("#radContainer .btnAnswers, br").remove();
reset();
    

 }); //--- Close  modal button 


//-- End of Ajax Success Last Line
           }).fail(function()
            {

/*---------------------------------------------------------------------
                       On Ajax fail 
---------------------------------------------------------------------*/                
            console.log("cannot get information"); 
            }); //-- End of Ajax fail 
          
          
      };


    
    
    
 


// --- close modal button 
$('button.close').click(function(){



});


   
 

//} //---- End of Ready Doc function 

 
 



    
//});


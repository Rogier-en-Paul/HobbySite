var writeOption0 = $("#writeOption0");
var moveOption0 = $("#moveOption0");
var writeOption1 = $("#writeOption1");
var moveOption1 = $("#moveOption1");
var output = $("#output");

var challenges = [
    new Challenge("Print a whooooole lot of 1's",[0,0,0,0,0],[1,1,1,1,1],0),
    new Challenge("Reverse a string of numbers 11001 becomes 00110",[1,1,0,0,1],[0,0,1,1,0],0),
    new Challenge("Copy the numbers on the left over to the right e.g. 111|0|000 becomes 111|0|111",[1,1,1,0,0,0,0],[1,1,1,0,1,1,1],3),
    new Challenge("Print as many 1's as you can with only 3 cards and finish on Card 0. This is is called the busy beaver problem and is very hard",[1,0,1,0,1,0,1],[1,1,1,0,1,1,1],3),
    new Challenge("Make photoshop",[0,0,0,0,0,0,0],[1,0,1,0,1,0,1],0),
    new Challenge("Go out and make some crazy patterns",[0,0,0,0,0,0,0],[1,0,1,0,1,0,1],0)
];

var tour = new Tour({
    backdrop: true,
    steps:[{
        title: 'False',
        content: 'This option will be executed if the machine reads a 0 from tape',
        element: '#optionFalse'
    },{
        title: 'True',
        content: 'And this if the machine reads a 1',
        element: '#optionTrue'
    },{
        title: 'Writing',
        content: 'After reading, write a 1, a 0 or nothing on the tape',
        element: '#writeOption0Container'
    },{
        title: 'Moving',
        content: 'After writing, move left, right or not at all',
        element: '#moveOption0Container'
    },{//not showing up
        title: 'nextCard',
        content: 'Load the next card to execute',
        element: '#nextCard1'
    },{
        title: 'card identity',
        content: 'Give the card a number. You can also overwrite old cards that you\'ve made in the past',
        element: '#txtCardNumber'
    },{
        title: 'Add card',
        content: 'Select a program to add the card to',
        element: '#btnAddCard'
    },{
        title: 'Program',
        content: 'This is your program. Execution will start at card 1. Card 0 is reserved and is the stop card. Entering a non existent card is considered crashing',
        element: '#programContainer',
        placement: 'top'
    },{
        title: 'Input',
        content: 'These are the 1\'s and 0\'s that your machine is going to change',
        element: '#Input'
    },{
        title: 'Program piping',
        content: 'Here you can select which program you want to run. If you feel fancy you can pipe the output of 1 into the other and make 1 monster machine',
        element: '#programOrder'
    },{
        title: 'Go!',
        content: 'Run: Run your selected program',
        element: '#btnRun'
    },{
        title: 'Careful',
        content: 'Step: You can go 1 step at a time. This can be usefull if your program is behaving oddly',
        element: '#stepGroup'
    },{
        title: 'Showtime!',
        content: 'Animate: Automatically steps for you every 0.2 seconds',
        element: '#stepGroup'
    },{
        title: 'bugs ):',
        content: 'If your program is not working as expected you can turn debugmode on and the program will halt on Cards that have their breakpoint enabled',
        element: '#btnDebugMode'
    },{
        title: 'continue',
        content: 'In contrast to run, continue won\'t go back to the beginning of your program nor reset the input. usefull when debugging',
        element: '#btnContinue'
    },{
        title: 'output',
        content: 'The fruit of your labour',
        element: '#output'
    },{
        title: 'ActiveCard',
        content: 'While your program is running you can see the card that is currently being evaluated here',
        element: '#activeCard'
    },{
        title: 'Challenges',
        content: 'Well let\'s see how this turings out',
        element: '#challenges',
        placement: 'left'
    }]
});

function startTour(){
    console.log("tour");
    tour.setCurrentStep(0);
    tour.init(true);
    tour.start(true);
}
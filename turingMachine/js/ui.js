var writeOption0 = $("#writeOption0");
var moveOption0 = $("#moveOption0");
var writeOption1 = $("#writeOption1");
var moveOption1 = $("#moveOption1");

var challenges = [
    new Challenge("Print a whooooole lot of 1's e.g. 00000 becomes 11111",function(program){
        var input = [0,0,0,0,0];
        var output = [1,1,1,1,1];
        program.reset(input);
        for(var i = 0; i < output.length; i++)program.execute();
        return compareArray(input, output);
    }),new Challenge("Reverse a string of numbers 11001 becomes 00110",function(program){
        var input = [1,1,0,0,1];
        var output = [0,0,1,1,0];
        program.reset(input);
        for(var i = 0; i < output.length; i++)program.execute();
        return compareArray(input, output);
    }),new Challenge("Print alternating 1\'s and 0\'s e.g. 0000000 becomes 10101010",function(program){
        var input = [0,0,0,0,0,0,0];
        var output = [1,0,1,0,1,0,1];
        program.reset(input);
        for(var i = 0; i < output.length; i++)program.execute();
        return compareArray(input, output);
    }),new Challenge("Copy the numbers on the left over to the right e.g. 111|0|000 becomes 111|0|111",function(program){
        var input = [1,1,1,0,0,0,0];
        var output = [1,1,1,0,1,1,1];
        program.reset(input);
        program.position = 3;
        program.run();
        return compareArray(input, output);
    }),new Challenge("Print as many 1's as you can with only 3 cards and finish on Card 0. This is is called the busy beaver game and is very hard",function(program){
        var input = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        program.reset(input);
        program.run();
        return program.currentCard == program.cards[0] && program.cards.length < 5 && program.count1s() == 6;
    }),new Challenge("Make photoshop",function(program){
        return true;
    }),new Challenge("Go out and make some crazy patterns",function(program){
        return true;
    })
];

//var incoming = new Tour({
//    backdrop: true,
//    steps:[{
//        orphan:true,
//        title: 'Turing Machine',
//        content: 'This website simulates a <b>turing machine</b>. A turing machine reads and writes information on a piece of <b>tape</b>.<br/> A turing machine is the most basic computer you can make\
//        <br/>Please watch the tutorial and take the tour it will help you get started. I put a lot of effort into it (:'
//    }]
//});
//incoming.init(true);
//incoming.start(true);

var tour = new Tour({
    backdrop: true,
    steps:[{
        orphan:true,
        title: 'Turing Machine',
        content: 'This website simulates a <b>turing machine</b>. A turing machine reads and writes information on a piece of <b>tape</b>.<br/> A turing machine is the most basic computer you can make'
    },{
        title: 'Getting Started',
        content: 'Over here are some videos to help you get started',
        element: '#pnlIntro'
    },{
        title: 'Creating a card',
        content: 'A turing machine relies on <b>Cards</b> with instructions on them',
        element: '#pnlCreateCard'
    },{
        title: 'Options',
        content: 'There are 2 <b>Options</b> a turing machine can choose from',
        element: '#rowOptions'
    },{
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
        content: 'After writing, move the machine left, right or not at all',
        element: '#moveOption0Container'
    },{
        title: 'nextCard',
        content: 'Load the next card to execute',
        element: '#nextCard1'
    },{
        title: 'card identity',
        content: 'Give the card a <b>Card number</b>. You can also overwrite old cards that you\'ve made in the past</br> <b>Card number is what you referred to with the previous <i>nextCard</i> field</b>',
        element: '#txtCardNumber'
    },{
        title: 'Add card',
        content: 'Add the card',
        element: '#btnAddCard'
    },{
        title: 'Program',
        content: 'This is your program. Execution will <b>start at card 1</b>. <b>Card 0</b>(not shown) is reserved and is the <b>stop card</b>. Entering a non existent card is considered crashing',
        element: '#programContainer',
        placement: 'top'
    },{
        title: 'Bridge',
        content: 'Here you can run and debug your program',
        element: '#bridge'
    },{
        title: 'Input',
        content: 'These are the 1\'s and 0\'s that your machine is going to change',
        element: '#Input'
    },{
        title: 'Go!',
        content: 'Run your program',
        element: '#runGroup'
    },{
        title: 'Animate',
        content: 'Click animate and you\'l see how the program behaves',
        element: '#runGroup'
    },{
        title: 'Careful',
        content: 'Step: You can go 1 step at a time. This can be usefull if your program is behaving oddly',
        element: '#stepGroup'
    },{
        title: 'Showtime!',
        content: 'Auto: Automatically steps for you every 0.2 seconds',
        element: '#stepGroup'
    },{
        title: 'Continue',
        content: 'In contrast to run, continue won\'t go back to the beginning of the tape your program nor reset the tape. usefull when debugging',
        element: '#stepGroup'
    },{
        title: 'Bugs ):',
        content: 'If your program is not working as expected you can turn debugmode on and the program will halt on Cards that have their breakpoint enabled',
        element: '#btnDebugMode'
    },{
        title: 'Output',
        content: 'The fruit of your labour',
        element: '#output'
    },{
        title: 'ActiveCard',
        content: 'While your program is running you can see the card that is currently being evaluated here',
        element: '#activeCard'
    },{
        title: 'Challenges',
        content: 'Well let\'s see how this <s>turns</s> turings out',
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
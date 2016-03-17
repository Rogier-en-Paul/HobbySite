var writeOption = $("#writeOption");
var moveOption = $("#moveOption");
var btnTour = $("#btnTour");
var txtProgramOrder = $("#programOrder");

//$('#programOrder').tokenfield({
//    autocomplete: {
//        source: ['red','blue','green','yellow','violet','brown','purple','black','white'],
//        delay: 100
//    },
//    showAutocompleteOnFocus: true
//});

var tour = new Shepherd.Tour({
    defaults: {
        classes: 'shepherd-theme-arrows'
    }
});

tour.addStep({
    title: 'Writing',
    text: 'select what should be written',
    attachTo: '#writeOption1 top'
}).addStep({
    title: 'Moving',
    text: 'move left right or stay',
    attachTo: '#moveOption1 left'
}).addStep({
    title: 'card identity',
    text: 'give the card a number. you can also overwrite old cards',
    attachTo: '#txtCardNumber left'
}).addStep({
    title: 'add card',
    text: 'select a program to add the card to and press add',
    attachTo: '#btnAddCard left'
}).addStep({
    title: 'program',
    text: 'this is the program that you\'re writing and where your Cards will appear',
    attachTo: '#programContainer left'
}).addStep({
    title: 'input',
    text: 'these are the 1\'s and 0\'s that your machine is going to change',
    attachTo: '#Input left'
}).addStep({
    title: 'program piping',
    text: 'here you can select which program you want to run. If you feel fancy you can pipe the output of 1 into the other and make 1 monster machine',
    attachTo: '#programOrder left'
}).addStep({
    title: 'Go!',
    text: 'run your selected program',
    attachTo: '#btnRun left'
}).addStep({
    title: 'Careful',
    text: 'you can go 1 step at a time. this can be usefull if your programm is behaving oddly',
    attachTo: '#btnStep left'
}).addStep({
    title: 'Showtime!',
    text: 'Once you toggle this on the program will automatically continue stepping every 0.2 seconds',
    attachTo: '#toggleAuto left'
}).addStep({
    title: 'bugs ):',
    text: 'if your program is not working as expected you can turn debugmode on and the program will halt on Cards that have their breakpoint enabled',
    attachTo: '#btnDebugMode left'
}).addStep({
    title: 'continue',
    text: 'in contrast to run, continue won\'t go back to the beginning of your program nor reset the input. usefull when debugging',
    attachTo: '#btnContinue left'
}).addStep({
    title: 'output',
    text: 'the fruit of your labour',
    attachTo: '#Output left'
}).addStep({
    title: 'ActiveCard',
    text: 'while your program is running you can see the card that is currently being evaluated here',
    attachTo: '#activeCardContainer left'
})

btnTour.click(function(){
    tour.start();
});
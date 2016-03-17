var writeOption = $("#writeOption");
var moveOption = $("#moveOption");
var btnTour = $("#btnTour");
var txtProgramOrder = $("#programOrder");

$('#programOrder').tokenfield({
    autocomplete: {
        source: ['red','blue','green','yellow','violet','brown','purple','black','white'],
        delay: 100
    },
    showAutocompleteOnFocus: true
});

var tour = new Tour();
tour.addStep({
    element: "#btnTour",
    title: "Title of my step",
    content: "Content of my step"
});

btnTour.click(function(){
    console.log("clicked");
    tour.init();
    tour.start();
});
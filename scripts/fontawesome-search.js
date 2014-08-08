(function ($) {
  'use strict';

  $(function () {

    // Initial fetch & render the icons into the HTML
    // so we can work with them as the user searches
    var iconJSON = window.icondata || {},
      tmpl = $('#tmpl').html(),
      // ms duration for Velocity animations
      DURATION = 75;

    $('.results').html(window.Mustache.render(tmpl, iconJSON));



    // Init bootstrap lib for killer tooltips
    $('tr').tooltip({ placement: 'right' });



    // I guess I'll write my own jankety typeahead
    function updateTypeahead () {
	console.time("update");
      
		var target    = $('#input-search').val(),
        $blankSlate = $('.blank-slate'),
        listIsEmpty = true,
        // easier to work with an array than the json object
        icons       = iconJSON.icons;


      // Check all the data to see if they match the search string
      for (var i = 0, max = icons.length; i < max; i++) {

        // Build a string that matches what appears in the UI
        // Every row has a name, but not all rows have aliases
        var iconString = icons[i].iconName;
        if (icons[i].aliases) {
          iconString = iconString + ', ' + icons[i].aliases;
        }

        // Do the actual check and row show/hides
        if(iconString.indexOf(target) != -1) {

          fadeInIfNecessary($('#' + icons[i].iconName));
          listIsEmpty = false;
        }
        else {
          fadeOutIfNecessary($('#' + icons[i].iconName));
        }
      }

      // If there are no LI's visible, show the blank slate
      if(listIsEmpty) {
        fadeInIfNecessary($blankSlate);
      }
      else {
        fadeOutIfNecessary($blankSlate);
      }
	  console.timeEnd("update");
    }


    // Velocity animation wrappers
    function fadeOutIfNecessary($elem) {

      if($elem.css('display') != 'none') {

        $elem.velocity('fadeOut', { duration: DURATION });
      }
    }

    function fadeInIfNecessary($elem) {

      if($elem.css('display') === 'none') {

        $elem.velocity('fadeIn', { duration: DURATION });
      }
    }


    // update the typeahead when the user types in the box
    $('#input-search').on('keyup', updateTypeahead);

    // update the typeahead when the user changes the hash
    $(window).on('hashchange', function () {

      $('#input-search').val((window.location.hash).slice(1));
      updateTypeahead();
    });

    // update the typeahead when the user arrives at the page with a hash
    if(window.location.hash !== "") {

      $('#input-search').val((window.location.hash).slice(1));
      updateTypeahead();
    }

  });
}(window.jQuery));

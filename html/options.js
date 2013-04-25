
/*global $:true, sjcl:true, chrome:true */

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery.js
 * src/hashmask.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

$(function () {
  'use strict';

  // Show HashMask
  $.hashmask.settings.alwaysShow = true;
  $.hashmask.start();

  // Place initial values into input fields
  $('#' + localStorage.hash).click();
  $('#delay-value').val(localStorage.delay);

  // Except for the salt; not shown until user goes to edit
  //reload_salt();

  // Change the user's hash
  $('.hash input').click(function (e) {
    var hash = localStorage.hash = e.target.value;

    // Update hash algorithm about to be used by hashmask
    var hashSettings = {
      hashUsed: hash,
      hashFunction: $.hashmask.hashAlgorithms[hash]
    };
    $.extend($.hashmask.settings, hashSettings);
    chrome.extension.sendRequest({eventName: 'settings'});

    // Refresh the hashmask on the page
    $('.hashmask-sparkline').remove();
    $('input[type=password]').hashmask({
      alwaysShow: true
    });
  });

  // Make the user's salt field editable
  $('.salt-edit').click( function (ev) {
    $('#salt-value').val(localStorage.salt);
    $('#salt-value').prop('disabled', false);
    $('.salt-edit-group').hide();
    $('.salt-save-group').show();
  });

  // Randomize the user's salt field
  $('.salt-rand').click( function (ev) {
    var randomWords = sjcl.random.randomWords(6, 0);
    var newSalt = sjcl.codec.base64.fromBits(randomWords);
    $('#salt-value').val(newSalt);
    $('#salt-value').prop('disabled', false);
    $('.salt-edit-group').hide();
    $('.salt-save-group').show();
  });

  // Save the user's salt
  $('.salt-save').click( function (ev) {
    localStorage.salt = $('#salt-value').val();
    $('#salt-value').prop('disabled', true);
    $('#salt-value').val('');
    $('.salt-edit-group').show();
    $('.salt-save-group').hide();

    var hashSettings = {
      salt: localStorage.salt
    };
    $.extend($.hashmask.settings, hashSettings);
    chrome.extension.sendRequest({eventName: 'settings'});

    // Refresh the hashmask on the page
    $('.hashmask-sparkline').remove();
    $('input[type=password]').hashmask({
      alwaysShow: true
    });
  });

  // Cancel editing the user's salt
  $('.salt-cancel').click( function (ev) {
    $('#salt-value').prop('disabled', true);
    $('#salt-value').val('');
    $('.salt-edit-group').show();
    $('.salt-save-group').hide();
  });

  // Save whatever delay the user has entered
  $('.delay-save').click( function (ev) {
    localStorage.delay = +($('#delay-value').val());

    var hashSettings = {
      sparkInterval: localStorage.delay
    };
    $.extend($.hashmask.settings, hashSettings);
    chrome.extension.sendRequest({eventName: 'settings'});

    // Refresh the hashmask on the page
    $('.hashmask-sparkline').remove();
    $('input[type=password]').hashmask({
      alwaysShow: true
    });
  });

  // Reload the stored delay
  $('.delay-reload').click( function (ev) {
    $('#delay-value').val(localStorage.delay + '');
  });

  // Show the stored delay
  $('.delay-show').click( function (ev) {
    window.alert(localStorage.delay);
  });
});

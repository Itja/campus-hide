// ==UserScript==
// @name         RWTH CAMPUS: Hide unused links from sidebar
// @namespace    https://github.com/Itja/campus-hide/raw/master/campus-hide.user.js
// @version      0.1
// @description  There is a link to show everything that is hidden. Hides cateories: 'Adressen', 'Dokumente', 'Aufgaben', 'E-Mail', 'Papierkorb'. Hides links: 'Einstellungen', 'Abmelden', 'Hilfe', 'StOEHn', 'EvaSys', 'Fachbereiche', 'Prüfungsordnungen', 'Tagesansicht', 'Monatsansicht', 'Geburtstags', 'Urlaubs', 'Telefonnr.', 'Hochschulstatistik'
// @author       Mitja Schmakeit
// @match        https://www.campus.rwth-aachen.de/office/*
// @require http://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// ==/UserScript==

var headlinesToHide = ['Adressen', 'Dokumente', 'Aufgaben', 'E-Mail', 'Papierkorb'];
var menuEntriesToHide = ['Einstellungen', 'Abmelden',
                         'Hilfe', 'StOEHn', 'EvaSys', 'Fachbereiche', 'Prüfungsordnungen',
                         'Tagesansicht', 'Monatsansicht', 'Geburtstags', 'Urlaubs',
                         'Telefonnr.', 'Hochschulstatistik'];

//for debugging purposes, we call this method instead of hiding directly
function hide(elem) {
    currentHideFunc(elem);
    //elem.hide();
    //elem.css( "background-color", "red" );
}

function realHide(elem) {
    elem.hide();
}

function realShow(elem) {
    elem.show();
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function getMenuEntryByName(title) {
    return $('td > a.nav:contains("' + title + '")').parent().parent();
}

function hideMenuEntry(title) {
    hide(getMenuEntryByName(title));
}

function addMenuEntry(elem) {
    var td = $('<td colspan="3"></td>').append(elem);
    var tr = $('<tr></tr>').append(td);
    menuTableBody.append(tr);
}

function getNavHeadlineByTitle(title) {
    return $('td.navigatorheadline:contains("' + title + '")').parent();
}

function hideNavigatorHeadline(title) {
    hide(getNavHeadlineByTitle(title));
}

function replaceHeadline(newHtml) {
    headlineCell.addClass('headline');
    headlineCell.addClass('tmHeadline');
    addGlobalStyle('.tmHeadline a { color: white; }');
    headlineCell.html(newHtml);
}

function pageCalendar() {
    console.log(mainTableCell);
    var out = [];
    var cals = {weekCalendar: 'Wochenansicht', dayCalendar: 'Tagesansicht', monthCalendar: 'Monatsansicht'};
    for (var x in cals) {
        if (path.match(x)) {
            out.push(cals[x]);
        } else {
            out.push('<a href="' + x + '.asp">' + cals[x] + '</a>');
        }
    }
    replaceHeadline(out.join(' | '));
}

function pageDisclaimer() {
    $('input[type="checkbox"]').prop('checked', true);
    $('input[value="Zustimmen"]').click();
}

function getContentTable(number) {
    return mainTableCell.find('> table:nth-child(' + number + ')');
}

function setupPageVars() {
    menuTableBody = $('body > table:nth-child(3) > tbody > tr > td:first-child > table:first-of-type > tbody');
    mainTableCell = $('body > table > tbody > tr > td[bgcolor="ffffff"]');
    mainHeadlineTable = mainTableCell.find('> table:first-child');
    headlineCell = mainHeadlineTable.find('> tbody > tr > td:nth-child(2)');
    if (headlineCell.length === 0) {
        headlineCell = mainHeadlineTable.find('> tbody > tr > td:first-child');
    }
    path = window.location.pathname;
}

function hideEverything() {
    hide($('body>table:first-child'));
    menuEntriesToHide.forEach(hideMenuEntry);
    headlinesToHide.forEach(hideNavigatorHeadline);
}

var mainTableCell, mainHeadlineTable, mainContentTable, headlineCell, path, menuTableBody;

var currentHideFunc = realHide;

(function() {
    'use strict';
    setupPageVars();
    hideEverything();
    var showHiddenLink = $('<a class="nav" style="font-weight: bold; border: 1px dashed white; color: white" href="#">Zeige Versteckte Elemente</a>');
    showHiddenLink.click((e) => {
        currentHideFunc = (elem) => {
            elem.show();
            elem.css('background-color', 'red');
        };
        hideEverything();
        showHiddenLink.attr('href', '');
        showHiddenLink.off('click');
        showHiddenLink.text('Verstecke Elemente');
        e.preventDefault();
    });
    addMenuEntry(showHiddenLink);
    if (path.match(/Calendar\.asp/)) {
        pageCalendar();
    } else if (path.match(/disclaimer\.asp/)) {
        pageDisclaimer();
    }
})();

"use strict";
exports.__esModule = true;
var fs = require("fs");
var companyName = "kindle-dict-creator";
function generateEntryXML(entry, idx) {
    var entryXML = [];
    // opening tags
    entryXML.push("<idx:entry name=\"english\" scriptable=\"yes\" spell=\"yes\">");
    entryXML.push("<idx:short>");
    entryXML.push("<a id=\"".concat(idx, "\"></a>"));
    // Define headword using <idx:orth> tag
    entryXML.push("<idx:orth value=\"".concat(entry.headword, "\">"));
    entryXML.push("<b>".concat(entry.headword, "</b>"));
    // add variations
    if (entry.variations) {
        entryXML.push('<idx:infl>');
        for (var _i = 0, _a = entry.variations; _i < _a.length; _i++) {
            var variation = _a[_i];
            entryXML.push("<idx:iform value=\"".concat(variation, "\"/>"));
        }
        entryXML.push('</idx:infl>');
    }
    entryXML.push('</idx:orth>');
    // Add pronunciation if provided
    if (entry.pronunciation) {
        entryXML.push("<idx:pron>".concat(entry.pronunciation, "</idx:pron>"));
    }
    // Add definition using <p> tag
    entryXML.push("<p>".concat(entry.definition, "</p>"));
    // Add examples if provided
    if (entry.examples) {
        entryXML.push('<ul>');
        for (var _b = 0, _c = entry.examples; _b < _c.length; _b++) {
            var example = _c[_b];
            entryXML.push("<li>".concat(example, "</li>"));
        }
        entryXML.push('</ul>');
    }
    // Add related terms if provided
    if (entry.related_terms) {
        entryXML.push('<idx:seealso>');
        for (var _d = 0, _e = entry.related_terms; _d < _e.length; _d++) {
            var relatedTerm = _e[_d];
            entryXML.push("<idx:orth value=\"".concat(relatedTerm, "\"/>"));
        }
        entryXML.push('</idx:seealso>');
    }
    // closing tags
    entryXML.push('</idx:short>');
    entryXML.push('</idx:entry>');
    return entryXML.join('');
}
function generateDictionaryXML(dictionary) {
    var dictionaryXML = [];
    // Start dictionary file
    dictionaryXML.push('<html xmlns:math="http://exslt.org/math" xmlns:svg="http://www.w3.org/2000/svg" xmlns:tl="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf"\n' +
        '\n' +
        '      xmlns:saxon="http://saxon.sf.net/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
        '\n' +
        '      xmlns:cx="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:dc="http://purl.org/dc/elements/1.1/"\n' +
        '\n' +
        '      xmlns:mbp="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:mmc="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:idx="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf">');
    dictionaryXML.push("<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"/><title>".concat(dictionary.title, "</title></head>"));
    dictionaryXML.push('<body>');
    dictionaryXML.push('<mbp:frameset>');
    // Add entries
    var lastLetter = 'a';
    dictionary.entries.forEach(function (entry, idx) {
        var entryXML = generateEntryXML(entry, idx);
        // add pagebreak between letters in dictionary
        var firstLetter = entry.headword[0].toLowerCase();
        if (firstLetter !== lastLetter) {
            dictionaryXML.push("<mbp:pagebreak>");
            lastLetter = firstLetter;
        }
        dictionaryXML.push(entryXML);
        dictionaryXML.push('<br>');
    });
    // End dictionary file
    dictionaryXML.push('</mbp:frameset></body></html>');
    return dictionaryXML.join('');
}
function generateOpfXML(dictionary) {
    var opfXML = [];
    // Start opf file
    opfXML.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n    <package unique-identifier=\"uid\">\n      <metadata>\n        <dc-metadata xmlns:dc=\"http://purl.org/metadata/dublin_core\" xmlns:oebpackage=\"http://openebook.org/namespaces/oeb-package/1.0/\" xmlns:opf=\"http://www.idpf.org/2007/opf\">\n          <dc:Language>en-us</dc:Language>\n          <dc:Title>".concat(dictionary.title, "</dc:Title>\n          <dc:Publisher>").concat(companyName, "</dc:Publisher>\n          <dc:creator opf:role=\"aut\">").concat(companyName, "</dc:creator>\n        </dc-metadata>\n        <x-metadata>\n          <output encoding=\"utf-8\" output=\"text/html\"/>\\\n          <DictionaryInLanguage>en-us</DictionaryInLanguage>\n          <DictionaryOutLanguage>en-us</DictionaryOutLanguage>\n          <DefaultLookupIndex>headword</DefaultLookupIndex>\n        </x-metadata>\n      </metadata>\n      <manifest>\n        <item id=\"html\" href=\"dictionary.html\" media-type=\"text/x-oeb1-document\"/>\n      </manifest>\n      <spine>\n        <itemref idref=\"html\"/>\n      </spine>\n    </package>\n  "));
    return opfXML.join('');
}
// Example usage
var entries = [
    {
        headword: 'hello',
        definition: 'an expression of greeting or goodwill',
        examples: ['she greeted him with a cheery hello', 'I heard a faint hello from the other side of the room'],
        variations: ["hi", "hey"],
        related_terms: ['greeting', 'salutation', 'welcome']
    },
    {
        headword: 'hell',
        definition: 'an expression of greeting or goodwill',
        examples: ['she greeted him with a cheery hello', 'I heard a faint hello from the other side of the room'],
        related_terms: ['greeting', 'salutation', 'welcome']
    },
    {
        headword: 'something',
        definition: 'an expression of greeting or goodwill',
        examples: ['she greeted him with a cheery hello', 'I heard a faint hello from the other side of the room'],
        related_terms: ['greeting', 'salutation', 'welcome']
    },
    {
        headword: 'world',
        definition: 'the earth with its inhabitants and all things upon it',
        examples: ['he was doing his bit to save the world', 'the worlds population'],
        related_terms: ['planet', 'globe', 'universe']
    }
];
var dictionary = {
    language: 'en',
    title: 'Reese Dictionary',
    entries: entries
};
var dictionaryXML = generateDictionaryXML(dictionary);
var opfXML = generateOpfXML(dictionary);
// Write dictionary file
fs.writeFileSync('dictionary/dictionary.html', dictionaryXML);
fs.writeFileSync('dictionary/dictionary.opf', opfXML);
// docs: https://ffeathers.wordpress.com/2018/04/15/building-an-amazon-kindle-book-via-html-and-opf/#:~:text=The%20Open%20Packaging%20Format%20(OPF,content%20file%20is%20your%2Dbook.
// kindle previewer: https://www.amazon.com/Kindle-Previewer/b?ie=UTF8&node=21381691011

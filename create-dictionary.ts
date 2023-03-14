import * as fs from 'fs';

interface DictionaryEntry {
  headword: string;
  pronunciation?: string;
  definition: string;
  examples?: string[];
  variations?: string[];
  related_terms?: string[];
}

interface Dictionary {
  language: string;
  title: string;
  entries: DictionaryEntry[];
}

const companyName = "kindle-dict-creator";

function generateEntryXML(entry: DictionaryEntry, idx: number): string {
  const entryXML: string[] = [];

  // opening tags
  entryXML.push(`<idx:entry name="english" scriptable="yes" spell="yes">`);
  entryXML.push(`<idx:short>`);
  entryXML.push(`<a id="${idx}"></a>`);

  // Define headword using <idx:orth> tag
  entryXML.push(`<idx:orth value="${entry.headword}">`);
  entryXML.push(`<b>${entry.headword}</b>`);

  // add variations
  if (entry.variations) {
    entryXML.push('<idx:infl>');
    for (const variation of entry.variations) {
      entryXML.push(`<idx:iform value="${variation}"/>`);
    }
    entryXML.push('</idx:infl>');
  }

  entryXML.push('</idx:orth>');

  // Add pronunciation if provided
  if (entry.pronunciation) {
    entryXML.push(`<idx:pron>${entry.pronunciation}</idx:pron>`);
  }

  // Add definition using <p> tag
  entryXML.push(`<p>${entry.definition}</p>`);

  // Add examples if provided
  if (entry.examples) {
    entryXML.push('<ul>');
    for (const example of entry.examples) {
      entryXML.push(`<li>${example}</li>`);
    }
    entryXML.push('</ul>');
  }

  // Add related terms if provided
  if (entry.related_terms) {
    entryXML.push('<idx:seealso>');
    for (const relatedTerm of entry.related_terms) {
      entryXML.push(`<idx:orth value="${relatedTerm}"/>`);
    }
    entryXML.push('</idx:seealso>');
  }

  // closing tags
  entryXML.push('</idx:short>');
  entryXML.push('</idx:entry>');

  return entryXML.join('');
}

function generateDictionaryXML(dictionary: Dictionary): string {
  const dictionaryXML: string[] = [];

  // Start dictionary file
  dictionaryXML.push('<html xmlns:math="http://exslt.org/math" xmlns:svg="http://www.w3.org/2000/svg" xmlns:tl="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf"\n' +
      '\n' +
      '      xmlns:saxon="http://saxon.sf.net/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '\n' +
      '      xmlns:cx="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:dc="http://purl.org/dc/elements/1.1/"\n' +
      '\n' +
      '      xmlns:mbp="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:mmc="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf" xmlns:idx="https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf">');

  dictionaryXML.push(`<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>${dictionary.title}</title></head>`);
  dictionaryXML.push('<body>');
  dictionaryXML.push('<mbp:frameset>');


  // Add entries
  let lastLetter = 'a';
  dictionary.entries.forEach((entry, idx) => {
    const entryXML = generateEntryXML(entry, idx);
    // add pagebreak between letters in dictionary
    const firstLetter = entry.headword[0].toLowerCase();
    if (firstLetter !== lastLetter) {
      dictionaryXML.push(`<mbp:pagebreak>`);
      lastLetter = firstLetter;
    }
    dictionaryXML.push(entryXML);
    dictionaryXML.push('<br />');
  });

  // End dictionary file
  dictionaryXML.push('</mbp:frameset></body></html>');

  return dictionaryXML.join('');
}

function generateOpfXML(dictionary: Dictionary): string {
  const opfXML: string[] = [];
  // Start opf file
  opfXML.push(`<?xml version="1.0" encoding="UTF-8"?>
    <package unique-identifier="uid">
      <metadata>
        <dc-metadata xmlns:dc="http://purl.org/metadata/dublin_core" xmlns:oebpackage="http://openebook.org/namespaces/oeb-package/1.0/" xmlns:opf="http://www.idpf.org/2007/opf">
          <dc:Language>en-us</dc:Language>
          <dc:Title>${dictionary.title}</dc:Title>
          <dc:Publisher>${companyName}</dc:Publisher>
          <dc:creator opf:role="aut">${companyName}</dc:creator>
        </dc-metadata>
        <x-metadata>
          <output encoding="utf-8" output="text/html"/>\\
          <DictionaryInLanguage>en-us</DictionaryInLanguage>
          <DictionaryOutLanguage>en-us</DictionaryOutLanguage>
          <DefaultLookupIndex>headword</DefaultLookupIndex>
        </x-metadata>
      </metadata>
      <manifest>
        <item id="html" href="dictionary.html" media-type="text/x-oeb1-document"/>
      </manifest>
      <spine>
        <itemref idref="html"/>
      </spine>
    </package>
  `);
  return opfXML.join('');
}

// Example usage
// const entries: DictionaryEntry[] = [
//   {
//     headword: 'hello',
//     definition: 'an expression of greeting or goodwill',
//     examples: ['she greeted him with a cheery hello', 'I heard a faint hello from the other side of the room'],
//     variations: ["hi", "hey"],
//     related_terms: ['greeting', 'salutation', 'welcome']
//   },
//   {
//     headword: 'hell',
//     definition: 'an expression of greeting or goodwill',
//     examples: ['she greeted him with a cheery hello', 'I heard a faint hello from the other side of the room'],
//     related_terms: ['greeting', 'salutation', 'welcome']
//   },
//   {
//     headword: 'something',
//     definition: 'an expression of greeting or goodwill',
//     examples: ['she greeted him with a cheery hello', 'I heard a faint hello from the other side of the room'],
//     related_terms: ['greeting', 'salutation', 'welcome']
//   },
//   {
//     headword: 'world',
//     definition: 'the earth with its inhabitants and all things upon it',
//     examples: ['he was doing his bit to save the world', 'the worlds population'],
//     related_terms: ['planet', 'globe', 'universe']
//   }
// ];

// const dictionary: Dictionary = {
//   language: 'en',
//     title: 'Reese Dictionary',
//   entries: entries
// };

fs.readFile("input.json", 'utf8', (err, data) => {
  if (err) {
    console.error("error", err);
    return;
  }

  const dictionary = JSON.parse(data);

  const dictionaryXML = generateDictionaryXML(dictionary);
  const opfXML = generateOpfXML(dictionary);

// Write dictionary file
  fs.writeFileSync('dictionary/dictionary.html', dictionaryXML);
  fs.writeFileSync('dictionary/dictionary.opf', opfXML);
});


// docs: https://ffeathers.wordpress.com/2018/04/15/building-an-amazon-kindle-book-via-html-and-opf/#:~:text=The%20Open%20Packaging%20Format%20(OPF,content%20file%20is%20your%2Dbook.
// kindle previewer: https://www.amazon.com/Kindle-Previewer/b?ie=UTF8&node=21381691011
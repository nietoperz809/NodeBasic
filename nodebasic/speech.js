const text2wav = require('text2wav');
const stream = require('stream');
const Speaker = require('speaker');
const wait = require ('wait-for-stuff');
const events = require('events');
const HashMap = require('hashmap');

events.EventEmitter.defaultMaxListeners = 0;
let eventEmitter = new events.EventEmitter();

function playAudioFromBuffer (audioBuff)
{
    let speaker = new Speaker({
        channels: 1,
        bitDepth: 16,
        sampleRate: 22050,
    });
    let bufferStream = new stream.PassThrough();
    bufferStream.end(audioBuff);
    bufferStream.pipe(speaker);

    speaker.on ('finish', function ()
    {
        eventEmitter.emit('fin');
    });
}

const map = new HashMap.HashMap();

async function speak(speech)
{
    let m = map.get (speech);
    if (m == undefined)
    {
        m = await text2wav(speech, {voice: 'de'});
        map.set (speech, m);
    }
    //let p = await text2wav(speech, {voice: 'de'});
    playAudioFromBuffer(m);
}

function speakSync (speech)
{
    let p = speak (speech);
    wait.for.event (eventEmitter, 'fin');
    //wait.removeAllListeners();
    //eventEmitter.removeAllListeners();
    //wait.for.promise(p);
}

module.exports.speakSync = speakSync;

//
//speakSync ("hallo, Ich bin ßämm, das software Maul.");
//speakSync ("fack you.");
//console.log ('done');



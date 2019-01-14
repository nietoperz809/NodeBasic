const text2wav = require('text2wav');
const fs = require('fs');
const stream = require('stream');
const Speaker = require('speaker');
const wait = require ('wait-for-stuff');

const speaker = new Speaker({
    channels: 1,
    bitDepth: 16,
    sampleRate: 22050
});

function playAudioFromBuffer(fileContents)
{
    let bufferStream = new stream.PassThrough();

    bufferStream
            .on('error', (err) => console.error('error ' +err))
            .on('end', () => console.log('passThrough-end'))
            .on('close', () => console.log('passThrough-close'))
            .on('unpipe', () => console.log('passThrough-unpipe'))
            .on('finish', () => console.log('passThrough-finish'));

    bufferStream.end(fileContents);
    bufferStream.pipe(speaker);
}

function saveWav (data)
{
    fs.writeFile('message.wav', data, (err) =>
    {
        if (err)
            throw err;
        console.log('It\'s saved!');
    });
}

async function speak(speech)
{
    let out = await text2wav(speech, {voice: 'de'});
    saveWav(out);
    //playAudioFromBuffer(out);
}

//let p = speak("hallo, Ich bin ßämm, das software Maul.");
//wait.for.promise(p);

let readStream = fs.createReadStream('message.wav');
//readStream.pipe(process.stdout); // okay
readStream.pipe(speaker); // err



//    let p = speak("hallo, Ich bin ßämm, das software Maul.");
//    wait.for.promise(p);
//    console.log (typeof p);


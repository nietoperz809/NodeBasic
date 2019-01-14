const edt = require ('./editor');
const Editor = new edt.Editor();
const syncinput = require('./syncinput');

/**
 * This is the start script
 */

process.stdout.write('*** Node BASIC ***');
while (1)
{
    process.stdout.write('\n>');
    let cmd = syncinput.getKeyInput().trim();
    let sp = cmd.split(' ');
    let res = true;
    switch (sp[0].toUpperCase())
    {
        case 'RENUMBER':
            Editor.renumber(sp);
            break;
        case 'LIST':
            Editor.list(sp);
            break;
        case 'DIR':
            Editor.dir(sp[1] || __dirname);
            break;
        case 'EDIT':
            res = Editor.edit(sp[1]);
            break;
        case 'SAVE':
            Editor.save(sp[1]);
            break;
        case 'LOAD':
            Editor.new();
            Editor.load(sp[1]);
            break;
        case 'NEW':
            Editor.new();
            break;
        case 'RUN':
            res = Editor.basicRun();
            break;
        case 'BYE':
            process.exit(0);
            break;
        case 'CLS':
            Editor.myClear();
            break;
        case '':
            break;
        default:
            res = Editor.rawInput(cmd);
            break;
    }
    if (false === res)
    {
        process.stdout.write('ERROR.');
    }
    else
    {
        process.stdout.write('READY.');
    }
}


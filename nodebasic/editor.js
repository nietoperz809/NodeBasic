'use strict';

const basic = require('./basic');
const syncinput = require('./syncinput');
const fs = require('fs');
const robot = require('robotjs');
const path = require('path');

function Editor()
{
    let program = [];

    let interpreter = new basic.Interpreter();
    interpreter.print_function = myprint;
    interpreter.string_input_function = myTextInput;
    interpreter.number_input_function = myNumberInput;
    interpreter.clear_function = this.myClear;

    function myTextInput()
    {
        return syncinput.getKeyInput().replace(/\n$/, '');
    }

    function myNumberInput()
    {
        let txt = myTextInput();
        return parseFloat(txt);
    }

    this.myClear = function ()
    {
        process.stdout.write('\u001b[2J\u001b[0;0H');
    };

    function myprint(text, eol)
    {
        if (text)
        {
            process.stdout.write(text);
            if (eol)
            {
                process.stdout.write('\n');
            }
        }
    }

    this.new = function()
    {
        program = [];
    };

    this.basicRun = function()
    {
        try
        {
            let txt = progToString();
            let p = new basic.Parser(txt);
            p.parse();
            interpreter.setParser(p);
            interpreter.interpret();
            return true;
        }
        catch (e)
        {
            console.log(e);
            return false;
        }
    };

    function immediate(txt)
    {
        try
        {
            let p = new basic.Parser('1 ' + txt);
            p.parse();
            interpreter.setParser(p);
            interpreter.interpret();
            return true;
        }
        catch (e)
        {
            console.log(e);
            return false;
        }
    }

    function progToString()
    {
        let out = '\n';
        for (let i = 0; i < program.length; i++)
        {
            out = out + program[i].n + ' ' + program[i].t + '\n';
        }
        return out;
    }

    this.save = function(filename)
    {
        try
        {
            let x = progToString();
            fs.writeFileSync(filename, x);
        }
        catch (e)
        {
            console.error('Cannot save ' + filename);
        }
    };

    this.load = function (filename)
    {
        try
        {
            let rawdata = fs.readFileSync(filename).toString();
            let sp = rawdata.split('\n');
            for (let s = 0; s < sp.length; s++)
            {
                if (sp[s])
                {
                    rawInput(sp[s]);
                }
            }
        }
        catch (e)
        {
            console.error('Cannot load ' + filename);
        }
    };

    this.dir = function(srcPath)
    {
        console.log('DIR of: ' + path.resolve(srcPath));
        fs.readdirSync(srcPath).forEach(function (file)
        {
            try
            {
                let stat = fs.statSync(srcPath + '//' + file);
                file = file.padEnd(20, ' ');
                if (stat.isDirectory())
                {
                    console.log(file + '<DIR>');
                }
                else
                {
                    console.log(file + stat.size);
                }
            }
            catch (e)
            {
            }
        });
    };

    this.renumber = function (args)
    {
        let renMap = [];
        let start = Number(args[1] || 10);
        let step = Number(args[2] || 10);

        program.forEach(function (elem, index)
        {
            renMap.push({old: program[index].n, new: start});
            program[index].n = start;
            start += step;
        });
        // Pass 2
        program.forEach(function (elem, index)
        {
            let linesplit = program[index].t.split(' ').map((item) => item.trim()).filter(Boolean);
            linesplit.forEach(function (lelem, lindex)
            {
                if (typeof lelem !== 'string')
                {
                    return;
                }
                let w = lelem.toUpperCase();
                if (w === 'GOTO' || w === 'GOSUB')
                {
                    renMap.forEach(function (relem)
                    {
                        if (relem.old === linesplit[lindex + 1])
                        {
                            linesplit[lindex + 1] = relem.new;
                        }
                    });
                }
            });
            program[index].t = linesplit.join(' ');
        });
    };

    this.list = function (fromto)
    {
        fromto.shift();
        fromto = fromto.join('');
        let start = 0;
        let end = Infinity;
        if (fromto !== '')
        {
            let ft = fromto.split('-');
            if (ft[1] === undefined)
            {
                start = ft[0];
                end = ft[0];
            }
            else if (ft[0] === '')
            {
                end = ft[1];
            }
            else if (ft[1] === '')
            {
                start = ft[0];
            }
            else
            {
                start = ft[0];
                end = ft[1];
            }
        }
        program.forEach(function (elem)
        {
            if (elem.n >= Number(start) && elem.n <= Number(end))
            {
                console.log(elem.n + ' ' + elem.t);
            }
        });
    };

    this.rawInput = function(line)
    {
        let match = line.match('^[0-9]+');
        if (match)
        {
            let num = match[0];
            let txt = line.substring(num.length).trim();
            basicLineInput(num, txt);
            return true;
        }
        else
        {
            return immediate(line);
        }
    };

    function deleteLine(num)
    {
        for (let i = 0; i < program.length; i++)
        {
            if (program[i].n === num)
            {
                program.splice(i, 1);
                return;
            }
        }
    }

    function basicLineInput(num, txt)
    {
        deleteLine(num);
        if (txt)
        {
            let line = {n: num, t: txt};
            program.push(line);
            program = program.sort(function (a, b)
            {
                return Number(a.n) > Number(b.n);
            });
        }
    }

    this.edit = function (num)
    {
        let line = '';
        for (let i = 0; i < program.length; i++)
        {
            if (program[i].n === num)
            {
                line = program[i].n + ' ' + program[i].t;
                break;
            }
        }
        if (line === '')
        {
            return false;
        }
        robot.typeString(line);
        let cmd = syncinput.getKeyInput().trim();
        return rawInput(cmd);
    }
}

module.exports.Editor = Editor;

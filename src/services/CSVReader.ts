import * as fs from 'fs';
import * as readline from 'readline';
import { UncorrelatedAccount } from '../models/UncorrelatedAccount';
import { parse } from 'csv-parse';
// Note, the `stream/promises` module is only available
// starting with Node.js version 16
import { finished } from 'stream/promises';


export class CSVReader {

    constructor(private filepath: string) {

    }

    public async processLine(callback: ((line: UncorrelatedAccount) => void | Promise<void>)): Promise<void> {
        this.checkExists();

        const parser = fs
            .createReadStream(this.filepath)
            .pipe(parse({
                columns: true,
                comment: '#'
            }));

        for await (const record of parser) {
            let result = callback(record as UncorrelatedAccount);
            if (result instanceof Promise) {
                await result;
            }
        }
    }

    private checkExists() {
        if (!fs.existsSync(this.filepath)) {
            throw new Error(`File ${this.filepath} does not exist`);
        }
    }

    // public async getHeaders(): Promise<string[]> {
    //     this.checkExists();
    //     return new Promise((resolve, reject) => {
    //         const input = fs.createReadStream(this.filepath);
    //         input.pipe(csvParser())
    //             .on('headers', (headers) => {
    //                 input.destroy();
    //                 resolve(headers);
    //             })
    //             .on('error', (err: any) => reject(err));
    //     });
    // }

    /**
     * 
     * @returns Number of line, not counting the header
     */
    public async getLines(): Promise<number> {
        this.checkExists();
        return new Promise((resolve, reject) => {
            const input = fs.createReadStream(this.filepath);
            const write2Null = fs.createWriteStream('/dev/null');
            var linesCount = -1;
            let rl = readline.createInterface(input, write2Null);
            rl.on('line', function (line) {
                linesCount++; // on each linebreak, add +1 to 'linesCount'
            });
            rl.on('close', function () {
                // returning the result when the 'close' event is called
                resolve(linesCount);
            });
            rl.on('error', (err: any) => reject(err));
        });
    }
}
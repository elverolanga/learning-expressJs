import multer from 'multer';
import { dirname, extname, resolve } from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

//files
//aws s3
//digital ocean spaces
//disk storange
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default
{
    storage: multer.diskStorage({
        destination: resolve(__dirname, "..","..","tmp","uploads"),
        filename:
            (req, file, callback) => {
                crypto.randomBytes(16, (err, res) => {
                    if(err) return callback;

                    return callback(null, res.toString('hex') + extname(file.originalname));
                });
            },
    }),
};

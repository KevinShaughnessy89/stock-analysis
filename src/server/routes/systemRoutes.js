import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const systemRoutes = {
    default: {
        path: '*',
        method: 'GET',
        pipeline: [
            {
                name: "setDefault",
                handler: async (req, res, next) => {
                    res.sendFile(join(__dirname, '..', '..', '..', 'public', '404.html'))
                }
            }
        ]
    },
}
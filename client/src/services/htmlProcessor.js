import parse from './htmlSanitizer/htmlSanitizer';
const createPipeline = (...steps) => async html => {
        const [initialStep] = steps;
        try {
            let result = await initialStep(html);
            for (const step of steps) {
                result = await step(result);
            }
            return result;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
};

const insertLineBrakes = html => html.replaceAll(/\n/g, '<br>');
const defaultPipeline = createPipeline(parse, insertLineBrakes);
const api = {
    createPipeline,
    defaultPipeline,
    insertLineBrakes
};

export default api;

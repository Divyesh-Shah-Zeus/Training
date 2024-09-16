importScripts('https://cdn.jsdelivr.net/npm/pyodide@0.25.0/pyodide.min.js');
// import { loadPyodide } from 'https://cdn.jsdelivr.net/npm/pyodide@0.25.0/pyodide.js';
// import { loadPyodide } from 'https://cdn.jsdelivr.net/npm/pyodide@0.25.0/pyodide.js';

let pyodide;

async function initializePyodide() {
    console.log("pyodide initialized started")
    pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'});
    // pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/gh/Divyesh-Shah-Zeus/Training@main/' });
    // pyodide = await loadPyodide({ indexURL: 'http://cms.localhost/assets/pyodide' });
    // let startTime = performance.now();

    await pyodide.loadPackage("http://cms.localhost/assets/combine_package-0.0.1-py3-none-any.whl");

    pyodide.runPython(`
from compare_equations.main import evaluate_math_answer
      `)

    console.log("pyodide initialized")
    // Signal that Pyodide has been initialized
    self.postMessage('pyodide_initialized');
}

// Handle messages from the main thread
self.onmessage = async function(event) {
    if (event.data === 'initialize_pyodide') {
        await initializePyodide();
        // self.postMessage('pyodide_initialized');
    } else {
        const jsonData = JSON.stringify(event.data).replace(/\\/g, '\\\\');
        pyodide.runPython(`
        import json
        data = json.loads('${jsonData}')
        result = evaluate_math_answer(data["option"], data["attemptedToken"], data["answerList"])
              `)
        // Send result back to the main thread
        self.postMessage(pyodide.globals.get("result"));
    }
}


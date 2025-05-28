'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function PythonEditor() {
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const codeRef = useRef('print("Hello from Python in WASM!")');

  useEffect(() => {
    const loadPyodide = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
      script.onload = async () => {
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
        });

        await pyodideInstance.loadPackage(['micropip']); 

        setPyodide(pyodideInstance);
      };
      document.body.appendChild(script);
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput('⏳ Pyodide загружается...');
      return;
    }

    const code = codeRef.current || '';

    try {
      const wrappedCode = `
        import sys
        from io import StringIO
        import traceback

        stdout = StringIO()
        stderr = StringIO()
        sys.stdout = stdout
        sys.stderr = stderr

        try:
            exec("""${code.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}""")
        except Exception:
            traceback.print_exc(file=stderr)

        result = stdout.getvalue() + stderr.getvalue()
        `;

      await pyodide.runPythonAsync(wrappedCode);
      const result = await pyodide.runPythonAsync('result');
      setOutput(result.trim() || '✅ Код выполнен без вывода');
    } catch (err) {
      setOutput(`❌ Ошибка выполнения:\n${err.toString()}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-full">
      <div className="w-full max-w-4xl h-96 border rounded-2xl shadow-xl overflow-hidden">
        <MonacoEditor
          defaultLanguage="python"
          defaultValue={codeRef.current}
          theme="vs-dark"
          onChange={(value) => {
            codeRef.current = value || '';
          }}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
          }}
        />
      </div>

      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
        onClick={runCode}
      >
        Run
      </button>

      <div className="w-full max-w-4xl p-4 bg-black text-green-400 font-mono rounded-xl shadow-inner min-h-[100px] whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import Editor from "@monaco-editor/react";

function CodeEditor({ onGraphButtonClick }) {
    const editorRef = useRef(null);
    const [timeoutId, setTimeoutId] = useState(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Add a paste event listener
        editor.onDidPaste(() => {
            // Get the first line of the editor
            let firstLine = '';
            try {
                firstLine = editor.getModel().getLineAt(1);
            } catch (error) {
                console.log(error);
            }

            // Check if the editor is empty
            if (editor.getModel().getLineCount() === 1 && firstLine === '') {
                // If the editor is empty, format the pasted content
                try {
                    const parsedJson = JSON.parse(editor.getValue());
                    const formattedJson = JSON.stringify(parsedJson, null, 2);
                    editor.setValue(formattedJson);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleEditorDidChange = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            try {
                const parsedJson = JSON.parse(editorRef.current.getValue());
                const formattedJson = JSON.stringify(parsedJson, null, 2);
                if (editorRef.current.getValue() !== formattedJson)
                editorRef.current.setValue(formattedJson);
            } catch (error) {
            }
        }, 5000);

        // Save the new timeout ID
        setTimeoutId(newTimeoutId);
    }

    const handleGraphButtonClick = () => {
        const jsonData = editorRef.current.getValue();
        onGraphButtonClick(jsonData);
    };

    useEffect(() => {
        document.getElementById('graph-button').addEventListener('click', handleGraphButtonClick);
    }, [onGraphButtonClick]);

    return (
        <div>
            <Editor
                height="95vh"
                defaultLanguage="json"
                defaultValue=""
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                    formatOnType: true,
                    formatOnPaste: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    tabSize: 2
                }}
            />
        </div>
    );
}

export default CodeEditor;
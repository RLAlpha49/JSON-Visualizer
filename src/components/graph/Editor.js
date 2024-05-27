import React, {useEffect, useRef, useCallback} from 'react';
import Editor from "@monaco-editor/react";

function CodeEditor({onGraphButtonClick}) {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        editor.onDidPaste(() => {
            let firstLine = '';
            try {
                firstLine = editor.getModel().getLineAt(1);
            } catch (error) {
                console.log(error);
            }

            if (editor.getModel().getLineCount() === 1 && firstLine === '') {
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

    const handleGraphButtonClick = useCallback(() => {
        const jsonData = editorRef.current.getValue();
        onGraphButtonClick(jsonData);
    }, [onGraphButtonClick]);

    useEffect(() => {
        document.getElementById('graph-button').addEventListener('click', handleGraphButtonClick);
    }, [handleGraphButtonClick]);

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
                    minimap: {enabled: true},
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
// eslint-disable-next-line no-unused-vars
import React, {useCallback, useContext, useEffect, useRef} from 'react';
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";
import {DarkModeContext} from "../context/DarkModeContext";

function CodeEditor({onGraphButtonClick}) {
    const editorRef = useRef(null);
    const {darkMode} = useContext(DarkModeContext);

    const handleEditorDidMount = (editor) => {
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
                theme={darkMode ? 'vs-dark' : 'vs-light'}
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

CodeEditor.propTypes = {
    onGraphButtonClick: PropTypes.func.isRequired
};

export default CodeEditor;
import React, { useEffect, useRef } from 'react';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { EditorView, lineNumbers, ViewUpdate } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from 'thememirror';

// Define a state effect that will replace the document with formatted JSON
const formatJsonEffect = StateEffect.define({map: (effect, mapping) => effect});

// Define a state field that responds to the formatJsonEffect by replacing the document
const formatJsonField = StateField.define({
    create: () => null,
    update(value, tr) {
        for (let effect of tr.effects) {
            if (effect.is(formatJsonEffect)) {
                return effect.value;
            }
        }
        return value;
    },
    provide: f => EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
            let tr = v.state.update({effects: formatJsonEffect.of(null)});
            v.view.dispatch(tr);
        }
    })
});

function Editor({ onGraphButtonClick }) {
    const editorViewRef = useRef(null);

    useEffect(() => {
        const state = EditorState.create({
            doc: '',
            extensions: [
                dracula,
                lineNumbers(),
                EditorView.lineWrapping,
                javascript(),
                formatJsonField,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        let doc = update.view.state.doc.toString();
                        try {
                            let parsedJson = JSON.parse(doc);
                            let formattedJson = JSON.stringify(parsedJson, null, 2);
                            if (doc !== formattedJson) {
                                let tr = update.view.state.update({
                                    changes: {from: 0, to: doc.length, insert: formattedJson},
                                    effects: formatJsonEffect.of(formattedJson)
                                });
                                update.view.dispatch(tr);
                            }
                        } catch (error) {
                            // If parsing fails, leave the data as is
                        }
                    }
                })
            ]
        });

        if (!editorViewRef.current) {
            editorViewRef.current = new EditorView({
                parent: document.querySelector('#editor'),
                state
            });
        }

        document.getElementById('graph-button').addEventListener('click', function () {
            const jsonData = editorViewRef.current.state.doc.toString();
            onGraphButtonClick(jsonData);
        });
    }, [onGraphButtonClick]);

    return (
        <div id="editor"></div>
    );
}

export default Editor;
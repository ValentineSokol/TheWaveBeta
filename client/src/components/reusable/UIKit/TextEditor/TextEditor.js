import React, { createRef, useState } from "react";
import htmlProcessor from '../../../../services/htmlProcessor';
import './TextEditor.scss';
import Button from "../Forms/Button";

function App() {
  const editorRef = React.createRef();
  const onInput = (e) => {
    e.preventDefault();
    const { childNodes } = e.target;
    const selection = getSelection();
    const anchorNode = selection.anchorNode;
    console.info({ selection, anchorNode })
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selection = getSelection();
      const anchorNode = selection.anchorNode;
      console.info({ selection, anchorNode })
      anchorNode.insertBefore(document.createElement('br'), anchorNode.lastChild);


    }

  }
  return (
    <div className='wysiwyg-container'>
     <div className='tools'>
       <span>B</span>
       <span>I</span>
       <span>Link</span>
     </div>
       <div className='TextAreaContainer'>
            <div ref={editorRef} className='TextEditor' contentEditable={true} onInput={onInput} onKeyDown={onKeyDown}>
            </div>
       </div>
    </div>
  );
}

export default App;

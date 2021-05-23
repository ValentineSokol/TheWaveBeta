import React, { createRef, useState } from "react";
import htmlProcessor from '../../../../services/htmlProcessor';
import './TextEditor.scss';
import Button from "../Forms/Button";

function App() {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [processedHTML, setProcessedHTML] = useState('');

  const textAreaRef = createRef();

  const getSelectionBoundaries = () => {
    const textarea = textAreaRef.current;
    const openingTagIndex = textarea.selectionStart;
    const closingTagIndex = textarea.selectionEnd;

    return [openingTagIndex, closingTagIndex];
  };
  const attributesToString = (attsObj) => {
    let attrsString = '';
    const keyValuePairs = Object.entries(attsObj);
    for ( const [key, value] of keyValuePairs) {
      attrsString += ` ${key}=${value} `;
    }
    return attrsString;

  };

  const wrapTextInTag = (tagName, attrs = '') => {
    const [openingTagIndex, closingTagIndex] = getSelectionBoundaries();
    const attrsString = attributesToString(attrs);
    let contentCopy = content.slice();
    const segmentToWrap = contentCopy.slice(openingTagIndex, closingTagIndex + 1);
    const wrappedSegment = `<${tagName} ${attrsString}>${segmentToWrap}</${tagName}>`;

    const textBeforeWrappedSegment = contentCopy.slice(0, openingTagIndex);
    const textAfterWrappedSegment = contentCopy.slice(closingTagIndex + 1);
    const newContent = `${textBeforeWrappedSegment}${wrappedSegment}${textAfterWrappedSegment}`;
    setContent(newContent);


  };
  const onChange = async ({ target: { value } }) => {
    setContent(value);
    const processedHTML = await htmlProcessor.defaultPipeline(value);
    setProcessedHTML(processedHTML);
  }
  const insertHyperLink = () => {
    let hrefPlaceholder = "'Your url here'";
    const attributeToInsert = {
      href: hrefPlaceholder
    };
    wrapTextInTag('a', attributeToInsert);
  };
  return (
    <div className='wysiwyg-container'>
     <div className='tools'>
       <span onClick={() => wrapTextInTag('b')}>B</span>
       <span onClick={() => wrapTextInTag('i')} >I</span>
       <span onClick={insertHyperLink}>Link</span>
     </div>
       <div className='TextAreaContainer'>
         { preview ?
           <div id='preview_box' dangerouslySetInnerHTML={{__html: processedHTML}} className='preview-container' />
           :
           <textarea ref={textAreaRef} rows='20' cols='20' value={content} onChange={onChange}/>
         }
         <Button onClick={() => setPreview(!preview)}>{`Show ${preview? 'text' : 'preview'}`}</Button>
       </div>
    </div>
  );
}

export default App;

import React from 'react';
import  './Toast.scss';

const Toast = ({ children }) => (
 <div className='Toast'>
     <p className='Toast__message'>{children}</p>
 </div>
);

export default Toast;

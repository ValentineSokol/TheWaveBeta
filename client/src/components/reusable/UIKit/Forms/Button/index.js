import React from "react";
import './Button.scss';
import classNames from "classnames";

const Button = ({ children, hover, color, size, type = 'button', transparent, className, disabled, clickHandler, testId }) => (
        <button
                type={type}
                disabled={disabled}
                className={
                        classNames(
                            'Button p-1',
                            {
                              'Button--transparent': transparent,
                              [`Button--color-${color}`]: color,
                              [`Button--size-${size}`]: size,
                              [`Button--hover-${hover}`]: hover,
                              [className]: className
                            })
                }
                onClick={clickHandler}
                data-testid={testId}
        >
                {children}
        </button>
);

export default Button;
import React from 'react';

/**
 * 
 * deayload page
 * @param {*}  
 */
export const  DelayLoading = ({ pastDelay, error }) => {
    if (pastDelay) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    } else {
        return null;
    }
}

/**
 * 
 * 动态插入css
 */
export const loadStyle = url => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
}

/**
 * 
 * 
 */
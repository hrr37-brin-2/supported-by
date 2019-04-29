import React from 'react';
import ReactDOM from 'react-dom';
import SupportSection from './components/SupportSection.jsx';

window.SupportSection = SupportSection;

ReactDOM.render(<SupportSection />, document.getElementById('app'));
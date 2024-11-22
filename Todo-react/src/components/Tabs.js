import React from 'react';
import './Tabs.css'; 
import Button from './Button';

const Tabs = ({ activeTab, setActiveTab, allCount, inprogressCount, completedCount }) => {
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs-container">
            <div className="tabs">
                <Button
                className={`tab-button ${activeTab === 'All' ? 'active' : ''}`}
                onClick={() => handleTabClick('All')}
                label={`All (${allCount})`}
                />
                <Button
                className={`tab-button ${activeTab === 'In-progress' ? 'active' : ''}`}
                onClick={() => handleTabClick('In-progress')}
                label={`In-progress (${inprogressCount})`}
                />
                <Button
                className={`tab-button ${activeTab === 'Completed' ? 'active' : ''}`}
                onClick={() => handleTabClick('Completed')}
                label={`Completed (${completedCount})`}
                />
            </div>
            <div className="tab-content">
               
            </div>
        </div>
    );
};

export default Tabs;

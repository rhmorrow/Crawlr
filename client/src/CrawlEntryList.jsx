import React from 'react';
import ReactDOM from 'react-dom';
import CrawlEntry from './CrawlEntry.jsx';
import { items } from 'semantic-ui-react';

const CrawlEntryList = (props) => {
return (
    <div>
      <h1>Your Crawl</h1>
      <h2>Bar List</h2>
      <div className="ui items">
        {props.barAdded.map(function(bar, index) {
        return <CrawlEntry
                removebar={props.removebar}
                key={index}
                index={index}
                bar={bar}
              />
        })}
      </div>
      {props.barAdded.length > 2 &&
      <button
        className="ui button"
        role="button"
        type="submit"
        onClick={props.createCrawl}
      >
        Create Your Crawl!
      </button>
      }
      {props.barAdded.length < 3 &&
         <button
        className="ui disabled button"
        disabled=""
        role="button"
        type="submit"
      >
        Select at least 3 bars
      </button>
      }
      <h5>Click 'x' to remove</h5>
    </div>
)
};

export default CrawlEntryList;
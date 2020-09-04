/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  Accordion, Card, Tabs, Tab,
} from 'react-bootstrap';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';
import { simpleSearchfunction } from 'store/actions/search';
import { useSelector, useDispatch } from 'react-redux';

import './style.scss';

function SearchInterface() {
  const allstate = useSelector((state) => state.search && state.search.searchresult);
  const searchquerry = useSelector((state) => state.search && state.search.searchquerry);
  // const more = useRef();
  const [search, setsearch] = useState();
  const [searchquerryes, Setsearchquerry] = useState('');
  const [searchinput, setsearchinput] = useState();
  // const [loading, setloading] = useState(false);

  useEffect(() => {
    if (allstate) {
      if (Object.keys(allstate).length > 0) {
        setsearch(allstate)(Setsearchquerry(searchquerry))(localStorage.setItem('loading', 'false'))(Swal.close());
      }
    }
  }, [allstate, searchquerry]);

  useEffect(() => {
    if (localStorage.getItem('loading') === 'true') {
      Swal.fire({
        html: 'Searching...', // add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
    }
  });

  useEffect(() => {
    setTimeout(() => {
      Swal.close();
      localStorage.setItem('loading', 'false');
    }, 5000);
  });

  // useEffect(() => {
  //   console.log(more.current.getBoundingClientRect());
  // }, [window.screenY]);

  const dispatch = useDispatch();
  return (
    <>
      <Header />
      <div className="main-content-wrapper">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="content-wrapper">
          <div className="content">
            <div className="searchresultmain">
              <div className="totalcount">
                {!!search && (
                  <div>
                    Showing
                    {' '}
                    {search.total ? search.total : '0'}
                    {' '}
                    results For
                    {' '}
                    <span>{searchquerryes}</span>
                  </div>
                )}
              </div>
              <div className="mian-content-search">
                <div className="left-search">
                  <div className="searchlibrary">
                    <Accordion defaultActiveKey="0">
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                          Search Library
                          <i className="fa fa-plus" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="body-search">
                              <input
                                value={searchinput}
                                onChange={(e) => {
                                  setsearchinput(e.target.value);
                                }}
                                type="text"
                                placeholder="Search"
                              />

                              <div
                                onClick={() => {
                                  if (searchinput) {
                                    Swal.fire({
                                      html: 'Searching...', // add html attribute if you want or remove
                                      allowOutsideClick: false,
                                      onBeforeOpen: () => {
                                        Swal.showLoading();
                                      },
                                    });
                                    dispatch(
                                      simpleSearchfunction(searchinput, 0, 100),
                                    );
                                  }
                                }}
                                className="src-btn"
                              >
                                Search
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                  {/* <div className="refinesearch">
                        <div className="headline">Refine your search</div>
                        <Accordion defaultActiveKey="">
                          <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                              Subject
                              <i className="fa fa-plus"></i>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body></Card.Body>
                            </Accordion.Collapse>
                          </Card>
                          <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                              Education Level
                              <i className="fa fa-plus"></i>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body></Card.Body>
                            </Accordion.Collapse>
                          </Card>
                          <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                              Rating
                              <i className="fa fa-plus"></i>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body></Card.Body>
                            </Accordion.Collapse>
                          </Card>
                          <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="3">
                              Type
                              <i className="fa fa-plus"></i>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="3">
                              <Card.Body></Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>
                      </div> */}
                </div>
                <div className="right-search">
                  <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                    <Tab
                      eventKey="all"
                      title={
                        !!search && !!search.total
                          ? `all (${search.total})`
                          : 'all (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.data.length > 0 ? (
                          search.data.map((res) => (
                            <div className="box">
                              <div className="imgbox">
                                <div
                                  style={{
                                    backgroundImage: res.thumb_url.includes('pexels.com')
                                      ? `url(${res.thumb_url})`
                                      : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                  }}
                                />
                                {/* <h5>CALCULUS</h5> */}
                              </div>
                              <div className="content">
                                <a
                                  href={
                                      res.model === 'Activity'
                                        ? `/activity/lti/preview/${res._id}`
                                        : res.model === 'Playlist'
                                          ? `/playlist/lti/preview/${res._id}`
                                          : ''
                                    }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <h2>{res.title || res.name}</h2>
                                </a>
                                <ul>
                                  <li>
                                    by
                                    {' '}
                                    <span className="author">
                                      {res.user_name}
                                    </span>
                                  </li>
                                  <li>
                                    Type
                                    {' '}
                                    <span className="type">{res.model}</span>
                                  </li>
                                  {/* <li>
                                          Member Rating{" "}
                                          <span className="type">Project</span>
                                        </li> */}
                                </ul>
                                <p>{res.description}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="box">no result found !</div>
                        )}
                      </div>
                    </Tab>
                    <Tab
                      eventKey="project"
                      title={
                        !!search && !!search.projects
                          ? `project (${search.projects})`
                          : 'project (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.data.length > 0 ? (
                          search.data.map((res) => (
                            <>
                              {res.model === 'Project' && (
                              <div className="box">
                                <div className="imgbox">
                                  <div
                                    style={{
                                      backgroundImage: res.thumb_url.includes('pexels.com')
                                        ? `url(${res.thumb_url})`
                                        : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                    }}
                                  />
                                  {/* <h5>CALCULUS</h5> */}
                                </div>
                                <div className="content">
                                  <h2>{res.title}</h2>
                                  <ul>
                                    <li>
                                      by
                                      {' '}
                                      <span className="author">
                                        {res.user_name}
                                      </span>
                                    </li>
                                    <li>
                                      Type
                                      {' '}
                                      <span className="type">{res.model}</span>
                                    </li>
                                    {/* <li>
                                          Member Rating{" "}
                                          <span className="type">Project</span>
                                        </li> */}
                                  </ul>
                                  <p>{res.description}</p>
                                </div>
                              </div>
                              )}
                            </>
                          ))
                        ) : (
                          <div className="box">no result found !</div>
                        )}
                      </div>
                    </Tab>
                    <Tab
                      eventKey="playlist"
                      title={
                        !!search && !!search.playlists
                          ? `playlist (${search.playlists})`
                          : 'playlist (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.data.length > 0 ? (
                          search.data.map((res) => (
                            <>
                              {res.model === 'Playlist' && (
                              <div className="box">
                                <div className="imgbox">
                                  <div
                                    style={{
                                      backgroundImage: res.thumb_url.includes('pexels.com')
                                        ? `url(${res.thumb_url})`
                                        : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                    }}
                                  />
                                  {/* <h5>CALCULUS</h5> */}
                                </div>
                                <div className="content">
                                  <h2>{res.title}</h2>
                                  <ul>
                                    <li>
                                      by
                                      {' '}
                                      <span className="author">
                                        {res.user_name}
                                      </span>
                                    </li>
                                    <li>
                                      Type
                                      {' '}
                                      <span className="type">{res.model}</span>
                                    </li>
                                    {/* <li>
                                          Member Rating{" "}
                                          <span className="type">Project</span>
                                        </li> */}
                                  </ul>
                                  <p>{res.description}</p>
                                </div>
                              </div>
                              )}
                            </>
                          ))
                        ) : (
                          <div className="box">no result found !</div>
                        )}
                      </div>
                    </Tab>

                    <Tab
                      eventKey="activity"
                      title={
                        !!search && !!search.activities
                          ? `activity (${search.activities})`
                          : 'activity (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.data.length > 0 ? (
                          search.data.map((res) => (
                            <>
                              {res.model === 'Activity' && (
                              <div className="box">
                                <div className="imgbox">
                                  <div
                                    style={{
                                      backgroundImage: res.thumb_url.includes('pexels.com')
                                        ? `url(${res.thumb_url})`
                                        : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                    }}
                                  />
                                  {/* <h5>CALCULUS</h5> */}
                                </div>
                                <div className="content">
                                  <h2>{res.title}</h2>
                                  <ul>
                                    <li>
                                      by
                                      {' '}
                                      <span className="author">
                                        {res.user_name}
                                      </span>
                                    </li>
                                    <li>
                                      Type
                                      {' '}
                                      <span className="type">{res.model}</span>
                                    </li>
                                    {/* <li>
                                          Member Rating{" "}
                                          <span className="type">Project</span>
                                        </li> */}
                                  </ul>
                                  <p>{res.description}</p>
                                </div>
                              </div>
                              )}
                            </>
                          ))
                        ) : (
                          <div className="box">no result found !</div>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                  {/* <div ref={more} className="">
                        Loading More
                      </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SearchInterface;
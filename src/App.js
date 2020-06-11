import React, { useEffect, useState } from 'react';
import {
    Layout,
    Input,
    Row,
    Col,
    Card,
    Tag,
    Spin,
    Alert,
    Modal,
    Typography,
    Tabs
} from 'antd';
import Tab1 from './tab1';
import 'antd/dist/antd.css';

const API_KEY = 'ce762116';
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;


const SearchBox = ({searchHandler}) => {
    return (
        <Row>
            <Col span={12} offset={6}>
                <Search
                    placeholder="enter movie & movie release year with , seperated"
                    enterButton="Search"
                    size="large"
                    onSearch={value => searchHandler(value)}
                />
            </Col>
        </Row>
    )
}

const ColCardBox = ({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal}) => {

    const clickHandler = () => {

        ActivateModal(true);
        DetailRequest(true);

        fetch(`http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            DetailRequest(false);
            ShowDetail(response);
        })
        .catch(({message}) => {
            DetailRequest(false);
        })
    }

    return (
        <Col style={{margin: '20px 0'}} className="gutter-row" span={4}>
            <div className="gutter-box">
                <Card
                    style={{ width: 200 }}
                    cover={
                        <img
                            alt={Title}
                            src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
                        />
                    }
                    onClick={() => clickHandler()}
                >
                    <Meta
                            title={Title}
                            description={false}
                    />
                    <Row style={{marginTop: '10px'}} className="gutter-row">
                        <Col>
                            <Tag color="magenta">{Type}</Tag>
                        </Col>
                    </Row>
                </Card>
            </div>
        </Col>
    )
}

const MovieDetail = ({Title, Poster, imdbRating, Rated, Runtime, Genre, Plot}) => {
    return (
        <Row>
            <Col span={11}>
                <img
                    src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
                    alt={Title}
                />
            </Col>
            <Col span={13}>
                <Row>
                    <Col span={21}>
                        <TextTitle level={4}>{Title}</TextTitle></Col>
                    <Col span={3} style={{textAlign:'right'}}>
                        <TextTitle level={4}><span style={{color: '#41A8F8'}}>{imdbRating}</span></TextTitle>
                    </Col>
                    <Col span={15} style={{textAlign:'right'}}>
                        <TextTitle level={4}><span style={{color: '#41A8F8'}}>Box Office: {imdbRating > 7 ? "HIT":"Flop"}</span></TextTitle>
                    </Col>
                </Row>
                <Row style={{marginBottom: '20px'}}>
                    <Col>
                        <Tag>{Rated}</Tag>
                        <Tag>{Runtime}</Tag>
                        <Tag>{Genre}</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col>{Plot}</Col>
                </Row>
            </Col>
        </Row>
    )
}

const Loader = () => (
    <div style={{margin: '20px 0', textAlign: 'center'}}>
        <Spin />
    </div>
)

function App() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [q, setName] = useState('');
    console.log(q);
    const v = q.split(',');
    console.log(v);
    const n = v[0];
    const y = v[1];
    console.log(n,y);
    const [activateModal, setActivateModal] = useState(false);
    const [detail, setShowDetail] = useState(false);
    const [detailRequest, setDetailRequest] = useState(false);


    useEffect(() => {

        setLoading(true);
        setError(null);
        setData(null);

          fetch(`http://www.omdbapi.com/?s=${n}&y=${y}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            if (response.Response === 'False') {
                setError("Start Searching");
                console.log(response);
            }
            else {
                setData(response.Search);
                console.log(response);
            }

            setLoading(false);
        })
        .catch(({message}) => {
            setError(message);
            setLoading(false);
        })

    }, [q]);


    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <div style={{ textAlign: 'center'}}>
                        <TextTitle style={{color: '#ffffff', marginTop: '14px'}} level={3}>Search Movie</TextTitle>
                    </div>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                <Tabs type="card">
                    <TabPane tab="Tab 1" key="1">
                            <Tab1 />
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">
                      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <span style={{ color: 'green', float: 'center', fontSize: '16px', marginLeft:'450px', marginBottom:'10px'}}>Search movie name and movie released year with (,)seperated</span>
                        <p></p>
                        <br />
                          <SearchBox searchHandler={setName} />
                          <br />

                          <Row gutter={16} type="flex" justify="center">
                              { loading &&
                                  <Loader />
                              }

                              { error !== null &&
                                  <div style={{margin: '20px 0'}}>
                                      <Alert message={error} type="error" />
                                  </div>
                              }

                              { data !== null && data.length > 0 && data.map((result, index) => (
                                  <ColCardBox
                                      ShowDetail={setShowDetail}
                                      DetailRequest={setDetailRequest}
                                      ActivateModal={setActivateModal}
                                      key={index}
                                      {...result}
                                  />
                              ))}
                          </Row>
                      </div>
                      <Modal
                          title='Detail'
                          centered
                          visible={activateModal}
                          onCancel={() => setActivateModal(false)}
                          footer={null}
                          width={800}
                          >
                          { detailRequest === false ?
                              (<MovieDetail {...detail} />) :
                              (<Loader />)
                          }
                      </Modal>
                    </TabPane>
                  </Tabs>
                </Content>
                <Footer style={{ textAlign: 'center' }}>2020</Footer>
            </Layout>
        </div>
    );
}

export default App;

import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom'
import { eventgetbyid } from '../../Events/event'
import { tokengetbyeventid } from '../../Events/token'


import BidNFTModal from '../../../components/components/modals/BidNFTModal';
import ViewBidNFTModal from '../../../components/components/modals/ViewBidNFTModal';

import DonateNFTModal from '../../../components/components/modals/DonateNFTModal';

export default function Auction() {
    const id = window.location.search.replace("?", "")
    console.log("id => ", id);
    const [CreatemodalShow, setDonateModalShow] = useState(false);

    const [eventId, setEventId] = useState(-1);
    const [list, setList] = useState([]);

    const [title, setTitle] = useState('');
    const [goalusd, setgoalusd] = useState('');
    const [goal, setgoal] = useState('');
    const [dateleft, setdateleft] = useState('');
    const [date, setdate] = useState('');
    const [dateleftBid, setdateleftBid] = useState('');
    const [logo, setlogo] = useState('');
    const [selectid, setselectid] = useState('');
    const [selecttitle, setselecttitle] = useState('');
    const [selecttype, setselecttype] = useState('');
    const [selectbid, setselectbid] = useState('');
    const boolTrue = true;
    const [eventuri, setEventuri] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [ViewmodalShow, setViewModalShow] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    function LeftDate(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        return (da.toString() + " Days " + h.toString() + " hours " + m.toString() + " minutes " + s.toString() + " seconds");
    }
    function LeftDateBid(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        return (da.toString() + "d " + h.toString() + "h " + m.toString() + "m " + s.toString() + "s");
    }
    async function AuctionfetchContractData() {

        if (id && window.location.pathname == "/donation/auction") {
            console.log("started chekcing");
            while (boolTrue) {
                try {
                    setEventId(id);
                    const value = await eventgetbyid(id);
                    const arr = [];

                    const totalTokens = await tokengetbyeventid(id);
                    for (let i = 0; i < totalTokens.length; i++) {
                        const object = await totalTokens[i];

                        if (object.name) {
                            var pricedes1 = 0;
                            try { pricedes1 = formatter.format(Number(object.Bidprice * 0.371936)) } catch (ex) { }

                            arr.push({
                                Id: object.id,
                                name: object.name,
                                description: object.description,
                                Bidprice: pricedes1,
                                price: Number(object.price),
                                type: object.type,
                                image: object.image,
                            });
                        }

                    }

                    setList(arr);
                    if (document.getElementById("Loading"))
                        document.getElementById("Loading").style = "display:none";


                    setEventuri(value);
                    setTitle(value.title);
                    setgoalusd(formatter.format(Number(value.Goal * 0.371936)));
                    setgoal(Number(value.Goal));
                    setdateleft(LeftDate(value.endDate));
                    setdate(value.endDate);
                    setdateleftBid(LeftDateBid(value.endDate));
                    setlogo(value.logolink);
                    break;
                } catch (error) {
                    continue;
                }
            }



        }

    }
    useEffect(() => {
        AuctionfetchContractData();

    }, []);

    setInterval(function () {
        calculateTimeLeft();
    }, 1000);


    function calculateTimeLeft() {
        try {
            var allDates = document.getElementsByName("dateleft");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDate(date);
            }
            var allDates = document.getElementsByName("date");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDateBid(date);
            }
        } catch (error) {

        }

    }



    function activateViewBidModal(e) {
        setselectid(e.target.getAttribute("tokenid"));
        setselecttitle(e.target.getAttribute("title"));

        setViewModalShow(true);
    }

    function activateBidNFTModal(e) {
        setselectid(e.target.getAttribute("tokenid"));

        setselectbid(e.target.getAttribute("highestbid"));
        console.log(selectbid);
        setselecttype("NFT");
        setModalShow(true);
    }
    function activateBidCryptopunkTModal(e) {
        setselectid(e.target.getAttribute("tokenid"));
        setselecttype("Cryptopunk");
        setselectbid(e.target.getAttribute("highestbid"));
        console.log(selectbid);

        setModalShow(true);
    }


    function activateCreateNFTModal(e) {
        setselecttype("NFT");

        setDonateModalShow(true);
    }

    function activateCreateCryptopunkModal(e) {
        setselecttype("Cryptopunk");

        setDonateModalShow(true);
    }

    return (
        <>

            <div className="row EventContainer" >
                <div style={{
                    display: 'flex',
                    width: '100%',
                    position: 'relative'
                }}>
                    <img src={logo} className="AuctionImage" />
                    <div className="DetialsContainer" style={{
                        rowGap: '16px',
                        paddingTop: '70px'
                    }}>
                        <h4 style={{
                            fontSize: '2.5rem'
                        }} >{title}</h4>

                        <div className='TextContainer'>
                            <h4 style={{
                                fontSize: '2.5rem'
                            }}>Goal: </h4>
                            <h4 style={{
                                fontSize: '2.5rem'
                            }}>$ {goalusd} ({goal} EVER)</h4>
                        </div>
                        <div className='TextContainer'>
                            <h4 style={{
                                fontSize: '2.5rem'
                            }} name='dateleft' date={date}>{dateleft}</h4>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', position: 'absolute', right: '25px' }} >
                        <div onClick={activateCreateNFTModal} className="card" style={{ color: 'white', overflow: 'hidden', background: '#0BD6BE', textAlign: 'center', width: '172px', cursor: 'pointer', height: '48px', margin: '0', padding: '0px' }}>
                            <div onClick={activateCreateNFTModal} className="card-body" style={{ height: '100%', paddingTop: '21px', fontSize: '21px' }}>Donate NFT</div>
                        </div>
                        <div className="card" onClick={activateCreateCryptopunkModal} style={{ color: 'white', overflow: 'hidden', background: '#0BD6BE', textAlign: 'center', cursor: 'pointer', float: 'right', width: '202px', height: '48px', padding: '0px' }}>
                            <div onClick={activateCreateCryptopunkModal} className="card-body" style={{ height: '100%', paddingTop: '21px', fontSize: '21px' }}>Donate Cryptopunk</div>
                        </div>

                    </div>


                </div>
            </div>
            <div id='Loading' className="LoadingArea">
                <h1>Loading...</h1>
            </div>
            {list.map((listItem) => (
                <div key={listItem.Id} className="row ElementsContainer bgWhite">
                    <div style={{
                        width: '100%',
                        display: 'flex'
                    }}>
                        {listItem.type == "Cryptopunk" ? (
                            <img src={listItem.image} className="AuctionBidImage pixel" />
                        ) : (
                            <img src={listItem.image} className="AuctionBidImage" />
                        )}

                        <div style={{ width: "100%" }}>
                            <div className="DetialsContainer" style={{ rowGap: "5px" }} >
                                <h1 >{listItem.name}</h1>

                                <h4 style={{ color: "rgb(139, 139, 139)" }}>Type: {listItem.type}</h4>

                                <div className="TextContainer">
                                    <h4 style={{ color: "#8B8B8B" }}>{listItem.description}</h4>
                                </div>
                            </div>
                            <div className='ElementBottomContainer'>
                                <div style={{ width: "116px" }}>
                                    <h3 className="smallgrey">Current bid</h3>
                                    <h4 className='bidprice'>$ {listItem.Bidprice} ({listItem.price} EVER)</h4>
                                    <h7 name="date" date={date} className="smallgrey">{dateleftBid}</h7>
                                </div>
                                <div className='BidAllcontainer' >
                                    <div className='Bidsbutton'>
                                        <div tokenid={listItem.Id} title={listItem.name} onClick={activateViewBidModal} className="Bidcontainer col">
                                            <div tokenid={listItem.Id} title={listItem.name} className="card BidcontainerCard">
                                                <div tokenid={listItem.Id} title={listItem.name} className="card-body bidbuttonText">View</div>
                                            </div>
                                        </div>


                                        {listItem.type == "Cryptopunk" ? (
                                            <div tokenid={listItem.Id} highestbid={listItem.price} className="Bidcontainer col" onClick={activateBidCryptopunkTModal}>
                                                <div tokenid={listItem.Id} highestbid={listItem.price} className="card BidcontainerCard">
                                                    <div tokenid={listItem.Id} highestbid={listItem.price} className="card-body bidbuttonText">Bid</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div tokenid={listItem.Id} highestbid={listItem.price} className="Bidcontainer col" onClick={activateBidNFTModal}>
                                                <div tokenid={listItem.Id} highestbid={listItem.price} className="card BidcontainerCard">
                                                    <div tokenid={listItem.Id} highestbid={listItem.price} className="card-body bidbuttonText">Bid</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <BidNFTModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    // This is a poor implementation, better to implement an event listener
                    fetchContractData();
                }}
                tokenId={selectid}
                type={selecttype}
                eventId={eventId}
                Highestbid={selectbid}
            />

            <ViewBidNFTModal
                show={ViewmodalShow}
                onHide={() => {
                    setViewModalShow(false);
                    // This is a poor implementation, better to implement an event listener
                    fetchContractData();
                }}
                id={selectid}
                title={selecttitle}
            />
            <DonateNFTModal
                show={CreatemodalShow}
                onHide={() => {
                    setDonateModalShow(false);
                    // This is a poor implementation, better to implement an event listener
                }}
                EventID={eventId}
                type={selecttype}
                SelectedTitle={title}
                enddate={date}
            />

        </>
    );
}

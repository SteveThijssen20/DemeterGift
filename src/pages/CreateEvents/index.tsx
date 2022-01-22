import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Observer } from 'mobx-react-lite';
import UseFormInput from '@/components/components/UseFormInput';
import proxy from 'http-proxy-middleware';
import { useIntl } from 'react-intl';
import { createEventAPI } from '@/pages/Events/event';
import { CreatePlugin } from '@/pages/Events/event';

import {
    BuilderField,
    BuilderSubmitButton,
    BuilderTransaction,
} from '@/modules/Builder/components'


export default function CreateEvents() {

    const CreateEvent = async () => {
        try {

            const id = await createEventAPI(EventTitle, EventDescription, EventDate, EventGoal, EventLogo);
            if (document.getElementById("plugin").checked) {
                CreatePlugin(`https://${window.location.hostname}/donation/auction?${id}`);
            }

            document.querySelectorAll('[href="/donation"]')[0].click()

        } catch (error) {
            console.error(error);
        }
    };

    // Application initialization

    const [EventTitle, EventTitleInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Title',
        id: ''
    });
    const [EventDescription, EventDescriptionInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Description',
        id: ''
    });
    const [EventDate, EventDateInput] = UseFormInput({
        defaultValue: "",
        type: 'datetime-local',
        placeholder: 'Event End Date ',
        id: 'enddate',
    });
    const [EventGoal, EventGoalInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Goal in EVER',
        id: 'goal',
    });
    const [EventLogo, EventLogoInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Logo Link',
        id: 'logo'
    });

    const [EventPlugin, EventPluginInput] = UseFormInput({
        defaultValue: "",
        type: 'checkbox',
        placeholder: 'Generate plugin?',
        id: 'plugin'
    });

    return (
        <><>

            <Row>

                <Col >
                    <div style={{ width: "500px", background: "transparent", padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                        <div style={{ margin: "0px 0px 30px 0px" }}>
                            <h1>Create Event</h1>
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h4>Event Title</h4>
                            {EventTitleInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h4>Event End Date</h4>
                            {EventDateInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h4>Event Goal</h4>
                            {EventGoalInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h4>Event Logo Link</h4>
                            {EventLogoInput}
                        </div>

                        <div style={{
                            margin: '18px 0px',
                            display: 'flex',
                            alignContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '5px'
                        }} >
                            <input type="checkbox" id="plugin" />
                            <h4>Generate Plugin?</h4>
                        </div>


                        <Button style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={CreateEvent}>
                            Create Event
                        </Button>
                    </div>
                </Col>

            </Row>

        </></>
    );
}

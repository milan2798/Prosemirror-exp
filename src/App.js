import React, { Component } from 'react';
import axios from 'axios';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import 'prosemirror-view/style/prosemirror.css';
import './App.css';
import logo from "./logo192.png";
import logo2 from "./logo512.png";
import { Schema, DOMParser, Node } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import 'prosemirror-view/style/prosemirror.css';
import {
    addMentionNodes
} from "./mentioncomponent/utils";
import {
    getMentionsPlugin
} from "./mentioncomponent/mentionPlugin";



class App extends Component {
    constructor(props) {
        super(props);


        let data = [{ name: "dog", id: "101", email: "joe@gmail.com", src: logo },
        { name: "cow", id: "102", email: "lewis@gmail.com", src: logo },
        { name: "black lab", id: "101", email: "joe@gmail.com", src: logo },
        { name: "yellow lab", id: "102", email: "lewis@gmail.com", src: logo },
        { name: "labrador retriever", id: "101", email: "joe@gmail.com", src: logo },
        { name: "labra-doodle", id: "102", email: "lewis@gmail.com", src: logo },
        { name: "black cat", id: "101", email: "joe@gmail.com", src: logo },
        { name: "cat", id: "101", email: "joe@gmail.com", src: logo },
        { name: "purple cow", id: "102", email: "lewis@gmail.com", src: logo }];
        let jsondoc = {
            "dog": "0",
            "cow": "0",
            "blacklab": "0",
            "yellowlab": "0",
            "labradorretriever": "0",
            "labradoodle": "0",
            "blackcat": "0",
            "cat": "0",
            "purplecow": "0"
        }
            ;
        this.state = {
            view: null,
            photos: [],
            data: data,
            jsondoc: jsondoc,
            jsont: {}
        };
        this.SearchImages = this.SearchImages.bind(this);




    }
    SearchImages = (query) => {

        let dt;
        fetch("https://api.unsplash.com/search/photos?query=" + query + "&client_id=RBIT2koapxwBkrfNRx6Og8NL7NbnYav8xuxYJb05SSw")
            .then((response) => response.json())
            .then((dat) => {
                console.log('This is your data', dat)
                this.setState({ photos: [...this.state.photos, dat.results[0]] })
                for (let i = 0; i < this.state.data.length; i++) {
                    if (this.state.data.length == this.state.photos.length) {
                        let items = [...this.state.data];
                        let item = { ...items[i] };
                        console.log("srcccc", this.state.photos.length)
                        item.src = this.state.photos[i].urls.thumb;
                        items[i] = item;
                        // 5. Set the state to our new copy
                        this.setState({ data: items })
                    }
                }
            });
        return dt;
    }
    componentDidUpdate() {

        console.log("Component did update", this.state.photos);

    }
    componentWillMount() {

        console.log("Component will mount", this.state.photos);
    }
    componentDidMount() {

        this.SearchImages("dog");
        this.SearchImages("cat");
        this.SearchImages("black lab");
        this.SearchImages("yellow lab");
        this.SearchImages("labrador retriever");
        this.SearchImages("labra-doodle");
        this.SearchImages("black cat");
        this.SearchImages("cow");
        this.SearchImages("purple cow");





        //  img1?this.setState({photos:[...this.state.photos,img1]}):   console.log("photos",this.state.photos);
        console.log("photos", this.state.photos)
        console.log("Component did mount");

        var schema = new Schema({
            nodes: addMentionNodes(addMentionNodes(basicSchema.spec.nodes)),
            marks: basicSchema.spec.marks
        });

        var getMentionSuggestionsHTML = items =>
            '<div class="suggestion-item-list">' +
            items.map(i => '<div class="suggestion-item">' + i.name + "</div>").join("") +
            "</div>";

        var mentionPlugin = getMentionsPlugin({
            getSuggestions: (type, text, done) => {
                setTimeout(() => {
                    if (type === "mention") {
                        // pass dummy mention suggestions

                        done(this.state.data);
                    }
                }, 0);

            },
            getSuggestionsHTML: (items, type) => {
                if (type === "mention") {
                    return getMentionSuggestionsHTML(items);
                }
            }
        });

        var plugins = exampleSetup({ schema: schema });
        // push it before keymap plugin to override keydown handlers
        plugins.unshift(mentionPlugin);
        const state = EditorState.create({ schema, plugins: plugins });

        const editor = new EditorView(this.editorEl, {
            state: state,

        });
        this.setState({ editor: state });
    }




    render() {
        let x = this.state.editor ? JSON.stringify(this.state.editor.toJSON(), null, 2) : '';

        let y = { ...this.state.jsondoc }


        return (
            <div className="App">

                <div className="column" ref={el => (this.editorEl = el)} />
                <div className="column">
                    <pre>{JSON.stringify(y, null, 2)}</pre>
                    <pre>{this.state.editor ? JSON.stringify(this.state.editor.toJSON(), null, 2) : ''}</pre>
                </div>
            </div>
        );
    }
}

export default App;

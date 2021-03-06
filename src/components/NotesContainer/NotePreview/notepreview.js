/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notePreviewDate } from '../../../helpers/helpers';
import { makeNoteActive } from '../../../store/ac';

class NotePreview extends React.Component {
    static defaultProps = {
        currentNote: {},
    }

    static propTypes = {
        currentNote: PropTypes.shape({
            name: PropTypes.string,
            content: PropTypes.string,
            edited: PropTypes.string,
            priority: PropTypes.bool,
            location: PropTypes.string,
            date: PropTypes.string,
            index: PropTypes.number,
            tags: PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
            }),
        }),
        onToggleDisplay: PropTypes.func.isRequired,
    }

    state = { displayedContent: '' }

    componentWillMount = () => {
        const { currentNote } = this.props;
        const displayed = this.markdownToNormal(currentNote.content);
        this.setState({ displayedContent: displayed });
    }

    componentWillReceiveProps = (nextProps) => {
        const { displayedContent } = this.state;
        if (nextProps.currentNote.content !== displayedContent) {
            const displayed = this.markdownToNormal(nextProps.currentNote.content);
            this.setState({ displayedContent: displayed });
        }
        if (nextProps.currentNote.content === '') {
            this.setState({ displayedContent: '' });
        }
    }

    markdownToNormal = (str) => {
        // eslint-disable-next-line no-undef
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    displayNote = () => {
        const { onToggleDisplay, currentNote } = this.props;
        onToggleDisplay(currentNote.index);
    }

    render() {
        let priorityBorder;
        const { currentNote } = this.props;
        const { displayedContent } = this.state;
        const thisMonth = notePreviewDate(currentNote.date, 'month');
        const thisDay = notePreviewDate(currentNote.date, 'day');
        const thisYear = notePreviewDate(currentNote.date, 'year');
        if (currentNote.priority) priorityBorder = { borderLeft: '5px solid gold' };
        const tags = currentNote.tags.value
            ? (
                <h5>
                    tag:
                    {currentNote.tags.value}
                </h5>
            )
            : <h5>tag: none</h5>;
        return (
            <div type="button" className="notePreview" onClick={this.displayNote} style={priorityBorder}>
                <div className="metaPreview">
                    <span className="datePreviewMax">
                        <h2>{thisDay}</h2>
                        <h3>{thisMonth}</h3>
                        <h4>{thisYear}</h4>
                    </span>
                </div>
                <div className="noteContentPreview">
                    <h2>{currentNote.name}</h2>
                    <p>{displayedContent}</p>
                    {tags}
                </div>
            </div>
        );
    }
}

export default connect(null,
    dispatch => ({
        onToggleDisplay: (noteIndex) => {
            dispatch(makeNoteActive(-1));
            setTimeout(() => dispatch(makeNoteActive(noteIndex)), 100);
        },
    }))(NotePreview);

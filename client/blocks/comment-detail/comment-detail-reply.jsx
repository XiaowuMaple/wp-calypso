/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import AutoDirection from 'components/auto-direction';
import { getCurrentUser } from 'state/current-user/selectors';

const TEXTAREA_MAX_HEIGHT = 236; // 10 lines
const TEXTAREA_MIN_HEIGHT_COLLAPSED = 47;
const TEXTAREA_MIN_HEIGHT_FOCUSED = 68; // 2 lines
const TEXTAREA_VERTICAL_BORDER = 2;

export class CommentDetailReply extends Component {
	state = {
		commentText: '',
		hasFocus: false,
		textareaMinHeight: TEXTAREA_MIN_HEIGHT_COLLAPSED,
	};

	bindTextareaRef = textarea => {
		this.textarea = textarea;
	}

	calculateTextareaMinHeight = () => {
		const textareaScrollHeight = this.textarea.scrollHeight;
		const textareaMinHeight = Math.min( TEXTAREA_MAX_HEIGHT, textareaScrollHeight + TEXTAREA_VERTICAL_BORDER );
		return Math.max( TEXTAREA_MIN_HEIGHT_FOCUSED, textareaMinHeight );
	}

	getTextareaPlaceholder = () => this.props.authorDisplayName
		? this.props.translate( 'Reply to %(commentAuthor)s…', {
			args: { commentAuthor: this.props.authorDisplayName }
		} )
		: 'Reply to comment…';

	handleTextChange = event => {
		const { value } = event.target;
		const textareaMinHeight = this.calculateTextareaMinHeight();

		this.setState( {
			commentText: value,
			textareaMinHeight,
		} );
	}

	setFocus = () => this.setState( {
		hasFocus: true,
		textareaMinHeight: this.calculateTextareaMinHeight(),
	} );

	submit = () => {
		const {
			commentId,
			currentUser,
			postId,
			postTitle,
			postUrl,
			submitComment,
		} = this.props;
		const { commentText } = this.state;

		const comment = {
			authorAvatarUrl: get( currentUser, 'avatar_URL', '' ),
			authorName: get( currentUser, 'display_name', '' ),
			authorUrl: get( currentUser, 'primary_blog_url', '' ),
			parentId: commentId,
			postId: postId,
			postTitle: postTitle,
			content: commentText,
			URL: postUrl,
		};
		submitComment( comment );
		this.setState( { commentText: '' } );
	}

	submitComment = event => {
		event.preventDefault();
		this.submit();
	}

	submitCommentOnCtrlEnter = event => {
		// Use Ctrl+Enter to submit comment
		if ( event.keyCode === 13 && ( event.ctrlKey || event.metaKey ) ) {
			event.preventDefault();
			this.submit();
		}
	}

	unsetFocus = () => this.setState( {
		hasFocus: false,
		textareaMinHeight: TEXTAREA_MIN_HEIGHT_COLLAPSED,
	} );

	render() {
		const { translate } = this.props;
		const {
			commentText,
			hasFocus,
			textareaMinHeight,
		} = this.state;

		const hasCommentText = commentText.trim().length > 0;

		const buttonClasses = classNames( 'comment-detail__reply-submit', {
			'is-active': hasCommentText,
			'is-visible': hasFocus || hasCommentText,
		} );

		const textareaClasses = classNames( {
			'is-focused': hasFocus,
		} );

		const textareaStyle = {
			minHeight: textareaMinHeight,
		};
		if ( ! hasFocus ) {
			// Force the textarea to collapse even if it was manually resized
			textareaStyle.height = TEXTAREA_MIN_HEIGHT_COLLAPSED;
		}
		if ( textareaMinHeight === TEXTAREA_MAX_HEIGHT ) {
			// Only show the scrollbar if the textarea content exceeds the max height
			textareaStyle.overflow = 'auto';
		}

		return (
			<form className="comment-detail__reply">
				<AutoDirection>
					<textarea
						className={ textareaClasses }
						onBlur={ this.unsetFocus }
						onChange={ this.handleTextChange }
						onFocus={ this.setFocus }
						onKeyDown={ this.submitCommentOnCtrlEnter }
						placeholder={ this.getTextareaPlaceholder() }
						ref={ this.bindTextareaRef }
						style={ textareaStyle }
						value={ commentText }
					/>
				</AutoDirection>
				<button
					className={ buttonClasses }
					disabled={ ! hasCommentText }
					onClick={ this.submitComment }
				>
					{ translate( 'Send' ) }
				</button>
			</form>
		);
	}
}

const mapStateToProps = state => ( {
	currentUser: getCurrentUser( state )
} );

export default connect( mapStateToProps )( localize( CommentDetailReply ) );

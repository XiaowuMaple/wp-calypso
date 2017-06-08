/**
 * External dependencies
 */
import { get, map, orderBy, uniq } from 'lodash';
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import EditorRevisionsListHeader from './header';
import EditorRevisionsListItem from './item';
import QueryPostRevisions from 'components/data/query-post-revisions';
import QueryUsers from 'components/data/query-users';
import getPostRevision from 'state/selectors/get-post-revision';
import getPostRevisions from 'state/selectors/get-post-revisions';
import {
	normalizeForDisplay,
	normalizeForEditing
} from 'state/selectors/utils/revisions';
import viewport from 'lib/viewport';

class EditorRevisionsList extends PureComponent {
	loadRevision = () => {
		this.props.loadRevision( this.props.selectedRevision );
	}

	trySelectingRevision() {
		if (
			this.props.selectedRevisionId === null &&
			this.props.revisions.length > 0 &&
			viewport.isWithinBreakpoint( '>660px' )
		) {
			this.props.selectRevision( this.props.revisions[ 0 ].id );
		}
	}

	componentWillMount() {
		this.trySelectingRevision();
	}

	componentDidMount() {
		// Make sure that scroll position in the editor is not preserved.
		window.scrollTo( 0, 0 );
	}

	componentDidUpdate() {
		this.trySelectingRevision();
	}

	render() {
		// NOTE: This supports revisions that have been hydrated with author
		// info (`author` is an object) and the ones that haven't (author is a
		// string, containing just the ID ).
		const usersId = uniq( map( this.props.revisions, r => get( r, 'author.ID', r.author ) ) );
		return (
			<div>
				<QueryPostRevisions
					postId={ this.props.postId }
					postType={ this.props.type }
					siteId={ this.props.siteId }
				/>
				<QueryUsers
					siteId={ this.props.siteId }
					usersId={ usersId }
				/>
				<EditorRevisionsListHeader
					loadRevision={ this.loadRevision }
					selectedRevisionId={ this.props.selectedRevisionId }
				/>
				<ul className="editor-revisions-list__list">
					{ map( this.props.revisions, revision => {
						const itemClasses = classNames(
							'editor-revisions-list__revision',
							{ 'is-selected': revision.id === this.props.selectedRevisionId }
						);
						return (
							<li className={ itemClasses } key={ revision.id }>
								<EditorRevisionsListItem
									revision={ revision }
									selectRevision={ this.props.selectRevision }
								/>
							</li>
						);
					} ) }
				</ul>
			</div>
		);
	}
}

EditorRevisionsList.propTypes = {
	loadRevision: PropTypes.func,
	postId: PropTypes.number,
	revisions: PropTypes.array,
	selectedRevision: PropTypes.object,
	selectedRevisionId: PropTypes.number,
	selectRevision: PropTypes.func,
	siteId: PropTypes.number,
	type: PropTypes.string,
};

export default connect(
	( state, ownProps ) => ( {
		revisions: orderBy(
			map(
				getPostRevisions( state, ownProps.siteId, ownProps.postId ),
				normalizeForDisplay
			),
			'date',
			'desc'
		),
		selectedRevision: normalizeForEditing(
			getPostRevision(
				state, ownProps.siteId, ownProps.postId, ownProps.selectedRevisionId
			)
		),
	} ),
)( EditorRevisionsList );

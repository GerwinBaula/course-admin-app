import React, { Component } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursePage extends Component {
  state = {
    redirectToAddCoursePage: false,
  };

  componentDidMount() {
    if (!this.props.courses.length) {
      this.props.actions.loadCourses().catch((error) => {
        alert("Loading courses failed " + error);
      });
    }

    if (!this.props.authors.length) {
      this.props.actions.loadAuthors().catch((error) => {
        alert("Loading authors failed " + error);
      });
    }
  }

  handleDeleteCourse = (course) => {
    toast.success("Course Deleted");
    this.props.actions.deleteCourse(course).catch(error => {
      toast.error("Delete failed." + error.message, { autoClose: false });
    });
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>

            <CourseList
              onDeleteClick={this.handleDeleteCourse}
              courses={this.props.courses}
            />
          </>
        )}
        ;
      </>
    );
  }
}

CoursePage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

// Only use the part of the state this component need.
function mapStateToProps(state) {
  return {
    courses: !state.authors.length
      ? []
      : state.courses.map((course) => {
          return {
            ...course,
            authorName: state.authors.find(
              (author) => author.id === course.authorId
            ).name,
          };
        }),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);

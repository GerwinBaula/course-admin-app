import React, { Component } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";

class CoursePage extends Component {
  // state = {
  //   course: {
  //     title: "",
  //   },
  // };

  // handleChange = (event) => {
  //   const course = { ...this.state.course, title: event.target.value };
  //   this.setState({ course });
  // };

  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   this.props.actions.createCourse(this.state.course);
  // };

  componentDidMount() {
    this.props.actions.loadCourses().catch((error) => {
      alert("Loading courses failed " + error);
    });

    this.props.actions.loadAuthors().catch((error) => {
      alert("Loading authors failed " + error);
    });
  }

  render() {
    // const { handleChange, handleSubmit } = this;
    // const { course } = this.state;

    return (
      <>
        {/* <form onSubmit={handleSubmit}>
          <h3>Add Course</h3>
          <input type="text" onChange={handleChange} value={course.title} />
          <input type="submit" value="Save" /> */}
        <h2>Courses</h2>
        <CourseList courses={this.props.courses} />
        {/* {this.props.courses.map((course) => (
          <div key={course.title}>{course.title}</div>
        ))} */}
        {/* </form> */}
      </>
    );
  }
}

CoursePage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);

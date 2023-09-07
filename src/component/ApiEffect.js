import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from 'react-toastify';
import { OverlayTrigger, Tooltip } from "react-bootstrap";


function ApiEffect() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editPost, setEditPost] = useState(null); // To store the post being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add modal
  const [newPost, setNewPost] = useState({ title: "", body: "" }); // State for new post

  const client = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/posts",
  });

  useEffect(() => {
    const FetchPost = async () => {
      try {
        let response = await client.get("?_limit=10");
        setPosts(response.data);
        setTitle(response.title);
        setBody(response.body);
      } catch (error) {
        console.log("Error from API", error);
      }
    };
    FetchPost();
  }, []);

  const DeletePost = (id) => {
    client.delete(`${id}`);
    setPosts(
      posts.filter((posts) => {
        return posts.id !== id;
      })
    );
    toast.success("Post deleted")
  };

  const handleEditPost = async () => {
    try {
      // Send a PUT request to update the post on the server
      await client.put(`/${editPost.id}`, editPost);
  
      // Update the post in the local state
      setPosts((prevPosts) =>
        prevPosts.map((prevPost) =>
          prevPost.id === editPost.id ? editPost : prevPost
        )
      );
  
      setIsModalOpen(false); // Close the modal
      toast.success("Post edited successfully!");
    } catch (error) {
      toast.error("Error updating post")
      console.error("Error updating post", error);
    }
  };

  const handleAddPost = async () => {
    try {
      // Send a POST request to add the new post
      const response = await client.post("", newPost);

      // Update the local state with the newly added post
      setPosts([...posts, response.data]);

      setIsAddModalOpen(false); // Close the modal
      toast.success("Post added successfully!");
      setNewPost({ title: "", body: "" }); // Clear the form
    } catch (error) {
      toast.error("Error adding post!");
      console.error("Error adding post", error);
    }
  };

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    const truncatedText = text.slice(0, maxLength) + "...";
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
      >
        <span>{truncatedText}</span>
      </OverlayTrigger>
    );
  }

  const handleCloseAdd = () => {
    setIsAddModalOpen(false)
    setNewPost({ title: "", body: "" });
  }
  

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
      <h1> Crud Function with API</h1>
      <Button
        className="btn btn-primary"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add
      </Button>
      </div>
      <Table className="table">
        <thead>
          <tr>
            <th className=""  scope="col">ID</th>
            <th className=""  scope="col">Title</th>
            <th className=""  scope="col">Body</th>
            <th className=""  scope="col">Action</th>
          </tr>
        </thead>

        <tbody class="table-group-divider">
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{post.id}</td>
              <td>{truncateText(post.title,50)}</td>
              <td className="">{truncateText(post.body, 50)}</td>
              <td className="row">
                <Button
                  className="btn btn-success col-md-6 col-sm-12"
                  onClick={() => {
                    setEditPost(post);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="btn btn-danger col-md-6 col-sm-12"
                  onClick={() => DeletePost(post.id)}
                >
                  Delete
                </Button>
              </td>
              {/* <td>
                <button
                  className="btn btn-danger"
                  onClick={() => DeletePost(post.id)}
                >
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editPost && (
              <Form>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editPost.title}
                    onChange={(e) =>
                      setEditPost({ ...editPost, title: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="body">
                  <Form.Label>Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editPost.body}
                    onChange={(e) =>
                      setEditPost({ ...editPost, body: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditPost}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}{isAddModalOpen && (
        <Modal show={isAddModalOpen} onHide={() => handleCloseAdd()}>
          <Modal.Header closeButton>
            <Modal.Title>Add Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="addTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="addBody">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newPost.body}
                  onChange={(e) =>
                    setNewPost({ ...newPost, body: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => handleCloseAdd()}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleAddPost} disabled={!newPost.title || !newPost.body}>
              Add Post
            </Button>
          </Modal.Footer>
        </Modal>
      )}


    </div>
  );
}

export default ApiEffect;

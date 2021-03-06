import * as actions from "./authSlice";

import api from "../../utils/api";

const fetchAuth = (url, method, operation, data = null, history) => async (
  dispatch
) => {
  dispatch(actions.loadAuth());
  try {
    if (operation === "LOGIN") {
      const response = await api({ url, method, data });
      dispatch(actions.loginAuth(response.data));
      localStorage.setItem("token", response.data.token);
      history.push("/");
    } else if (operation === "SIGNUP") {
      await api({ url, method, data });
      history.push({
        pathname: "/",
        state: { message: "A confirmation email has been sent" },
      });
    } else if (operation === "UPDATE" || operation === "PHOTO") {
      const response = await api({
        url,
        method,
        data,
        headers: {
          "Content-Type":
            operation === "UPDATE" ? "application/json" : "multipart/form-data",
        },
      });
      dispatch(actions.updateAuth(response.data));
    } else {
      localStorage.removeItem("token");
      dispatch(actions.logoutAuth());
      history.push("/");
    }
  } catch (err) {
    console.log(err);
    dispatch(actions.errorAuth());
  }
};

export default fetchAuth;

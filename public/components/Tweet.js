class Tweet extends Emitter {
  constructor(component) {
    super(component);
    this.profilePic = component.querySelector('img');
    this.name = component.querySelector('.name');
    this.username = component.querySelector('.username');
    this.text = component.querySelector('h1');
    this.repliesCount = component.querySelector('.replies-count');
    this.timestamp = component.querySelector('.timestamp');
  }

  getInitialStatus() {
    return {show: false};
  }

  async didReceiveData(response) {
    if (!response.url.match(/\/tweet\/\d{1,19}/)) {
      return;
    }

    if (!response.ok) {
      this.setState({show: false});
      return;
    }

    const data = await response.clone().json();

    this.setState({
      show: true,
      profilePic: data.includes.users[0].profile_image_url,
      name:  data.includes.users[0].name,
      username: '@' + data.includes.users[0].username,
      text: data.data.text,
      repliesCount: `${data.data.public_metrics.reply_count} ${data.data.public_metrics.reply_count === 1 ? 'reply' : 'replies'}`,
      timestamp: Intl.DateTimeFormat(navigator.language, {dateStyle: 'long'}).format(new Date(data.data.created_at)),
    });
  }

  render() {
    if (!this.state.show) {
      this.component.style.display = 'none';
      return;
    }

    Object.keys(this.state).forEach(key => {
      if (!this[key]) {
        return;
      }

      if (key === 'profilePic') {
        this[key].src = this.state[key];
      } else {
        this[key].innerText = this.state[key];
      }
    });

    this.component.style.display = 'block';
  }
}
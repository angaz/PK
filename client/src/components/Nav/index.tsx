import styles from './Nav.module.scss';

type PropTypes = {
  accounts: string[];
}

type AccountsPropTypes = {
  accounts: string[];
}

const Accounts = ({accounts}: AccountsPropTypes) => {
  if (accounts === undefined || accounts.length === 0) {
    return <span>Not connected</span>;
  }
  if (accounts.length === 1) {
    return <span>{accounts[0]}</span>;
  }
  return <span>Many accounts</span>;
}

const Nav = ({accounts}: PropTypes) => {
  return (
    <div className={styles.Nav}>
      <div></div>
      <div>
        <Accounts accounts={accounts} />
      </div>
    </div>
  )
};

export default Nav;

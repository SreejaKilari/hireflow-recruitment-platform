import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  FileText,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, isJobSeeker, isRecruiter, isAdmin, logout } = useAuth();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/seeker/dashboard';
  };

  const navLinks = [
    { label: 'Browse Jobs', path: '/jobs' },
    { label: 'Companies', path: '/companies' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className="glass-nav"
      style={{
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="app-container"
        style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={22} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Hire<span style={{ color: 'var(--color-accent)' }}>Flow</span>
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.65rem',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                border: '1px solid var(--color-accent-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span className="pulse-dot" />
              by Kilari Sreeja
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                  padding: '0.5rem 0',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons / User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Recruiter Quick Post Job button */}
              {isRecruiter && (
                <Button
                  size="sm"
                  variant="accent"
                  icon={<PlusCircle size={16} />}
                  onClick={() => navigate('/recruiter/post-job')}
                >
                  Post Job
                </Button>
              )}

              {/* In-app Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    position: 'relative',
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        backgroundColor: 'var(--color-danger)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '320px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--color-border)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                        {unreadCount} new
                      </span>
                    </div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <p style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          No notifications yet
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markAsRead(n._id);
                              if (n.link) navigate(n.link);
                              setNotifDropdownOpen(false);
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              borderBottom: '1px solid var(--color-border)',
                              backgroundColor: n.isRead ? '#ffffff' : 'var(--color-primary-light)',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                          >
                            <p style={{ fontWeight: n.isRead ? 400 : 600, color: 'var(--color-text-primary)' }}>
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--color-text-secondary)" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '220px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100,
                      overflow: 'hidden',
                      padding: '0.5rem 0',
                    }}
                  >
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                        {user?.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {user?.email}
                      </p>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--color-accent)',
                        }}
                      >
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>

                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 1rem',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    {isJobSeeker && (
                      <>
                        <Link
                          to="/seeker/profile"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.65rem 1rem',
                            color: 'var(--color-text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/seeker/applications"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.65rem 1rem',
                            color: 'var(--color-text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          <FileText size={16} />
                          My Applications
                        </Link>
                      </>
                    )}

                    {isRecruiter && (
                      <Link
                        to="/recruiter/company-profile"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.65rem 1rem',
                          color: 'var(--color-text-primary)',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        <User size={16} />
                        Company Profile
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.65rem 1rem',
                          color: 'var(--color-text-primary)',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        <ShieldCheck size={16} />
                        User Management
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border)', margin: '0.25rem 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.65rem 1rem',
                        color: 'var(--color-danger)',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              padding: '4px',
            }}
            className="mobile-toggle"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                padding: '0.5rem 0',
              }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to={getDashboardRoute()}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                padding: '0.5rem 0',
              }}
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
